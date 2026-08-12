import { DurableObject, env } from 'cloudflare:workers';
import { parseCookie, stringifySetCookie } from 'cookie';
import { sessionLifecycleEvent } from '@/analytics';
import type { Session } from '@/types';

const sessionIdCookieKey = 'rwsdk-jeopardy-session';
const sessionDurationInSeconds = 60 * 60 * 24 * 14; // 14 days

interface SessionIdParts {
	unsignedSessionId: string;
	signature: string;
}

const packSessionId = (unsignedSessionId: string, signature: string): string => {
	return btoa([unsignedSessionId, signature].join(':'));
};

const unpackSessionId = (packed: string): SessionIdParts => {
	const [unsignedSessionId, signature] = atob(packed).split(':');
	return { unsignedSessionId, signature };
};

const arrayBufferToHex = (buffer: ArrayBuffer): string => {
	const array = new Uint8Array(buffer);
	return Array.from(array)
		.map(b => b.toString(16).padStart(2, '0'))
		.join('');
};

async function createSessionSignature(unsignedSessionId: string): Promise<string> {
	const encoder = new TextEncoder();

	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(env.SESSION_SECRET_KEY),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign'],
	);

	const signatureArrayBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(unsignedSessionId));

	return arrayBufferToHex(signatureArrayBuffer);
}

async function isValidSessionId(signedSessionId: string): Promise<boolean> {
	try {
		const { unsignedSessionId, signature } = unpackSessionId(signedSessionId);
		const computedSignature = await createSessionSignature(unsignedSessionId);
		return computedSignature === signature;
	} catch {
		return false;
	}
}

const sessionCookie = {
	getSessionId: async (request: Request): Promise<string | null> => {
		const cookieHeader = request.headers.get('Cookie');
		if (!cookieHeader) {
			return null;
		}
		const existingCookie = parseCookie(cookieHeader);
		if (!existingCookie[sessionIdCookieKey]) {
			return null;
		}
		const signedSessionId = existingCookie[sessionIdCookieKey];
		if (!(await isValidSessionId(signedSessionId))) {
			throw new Error(`Invalid session ID`);
		}
		const { unsignedSessionId } = unpackSessionId(signedSessionId);
		return unsignedSessionId;
	},
	set: (signedSessionId: string, maxAge: number, headers: Headers): void => {
		const isViteDev = import.meta.env.DEV;
		headers.set(
			'Set-Cookie',
			stringifySetCookie({
				name: sessionIdCookieKey,
				value: signedSessionId,
				path: '/',
				httpOnly: true,
				secure: !isViteDev,
				sameSite: 'lax',
				maxAge,
			}),
		);
	},
};

export const sessions = {
	// intended for the middleware use case
	loadFromRequest: async (request: Request, headers: Headers): Promise<Session | null> => {
		const unsignedSessionId = await sessionCookie.getSessionId(request);
		if (!unsignedSessionId) {
			return null;
		}
		sessionLifecycleEvent({ sessionId: unsignedSessionId, event: 'LOAD' });
		const sessionDOId = env.SESSION_DURABLE_OBJECT.idFromName(unsignedSessionId);
		const doStub = env.SESSION_DURABLE_OBJECT.get(sessionDOId);
		try {
			return await doStub.getSession();
		} catch {
			sessionCookie.set('', 0, headers);
			sessionLifecycleEvent({ event: 'RESET' });
			return null;
		}
	},
	// upsert to DO and ensure response header is set
	upsert: async (unsignedSessionId: string | null, headers: Headers, sessionData: Partial<Session>): Promise<Session> => {
		if (!unsignedSessionId) {
			unsignedSessionId = crypto.randomUUID();
		}
		const signature = await createSessionSignature(unsignedSessionId);
		const signedSessionId = packSessionId(unsignedSessionId, signature);
		const sessionDOId = env.SESSION_DURABLE_OBJECT.idFromName(unsignedSessionId);
		const doStub = env.SESSION_DURABLE_OBJECT.get(sessionDOId);
		const savedSession = await doStub.saveSession(unsignedSessionId, sessionData);
		sessionCookie.set(signedSessionId, sessionDurationInSeconds, headers);
		sessionLifecycleEvent({ sessionId: unsignedSessionId, event: 'UPSERT', userId: sessionData.userId });
		return savedSession;
	},
	// remove from DO and clear cookie
	clear: async (request: Request, headers: Headers): Promise<void> => {
		const unsignedSessionId = await sessionCookie.getSessionId(request);
		if (!unsignedSessionId) {
			return;
		}
		const sessionDOId = env.SESSION_DURABLE_OBJECT.idFromName(unsignedSessionId);
		const doStub = env.SESSION_DURABLE_OBJECT.get(sessionDOId);
		const toBeRevokedSession = await doStub.getSession();
		await doStub.revokeSession();
		sessionCookie.set('', 0, headers);
		sessionLifecycleEvent({ sessionId: unsignedSessionId, event: 'CLEAR', userId: toBeRevokedSession.userId });
	},
};

export class SessionDurableObject extends DurableObject {
	private session: Session | undefined = undefined;
	constructor(state: DurableObjectState, env: Cloudflare.Env) {
		super(state, env);
		this.session = undefined;
	}

	// seems a little silly but this makes testing much easier
	protected now(): number {
		return Date.now();
	}

	async getSession(): Promise<Session> {
		if (this.session) {
			// Update lastAccessedAt even for cached sessions
			this.session.lastAccessedAt = this.now();
			await this.ctx.storage.put<Session>('session', this.session);
			return this.session;
		}

		const session = await this.ctx.storage.get<Session>('session');

		if (!session) {
			sessionLifecycleEvent({ event: 'INVALID' });
			throw new Error(`Invalid session`);
		}

		if (session.lastAccessedAt + sessionDurationInSeconds * 1000 < this.now()) {
			const revokedSession = await this.revokeSession();
			sessionLifecycleEvent({ sessionId: revokedSession?.sessionId, event: 'EXPIRED', userId: revokedSession?.userId });
			throw new Error(`Session expired`);
		}

		// Update lastAccessedAt on read
		session.lastAccessedAt = this.now();
		await this.ctx.storage.put<Session>('session', session);
		this.session = session;
		return session;
	}

	async saveSession(unsignedSessionId: string, sessionData: Partial<Session>): Promise<Session> {
		const now = this.now();
		const updatedSession: Session = {
			sessionId: unsignedSessionId,
			...sessionData,
			lastAccessedAt: now,
		};
		await this.ctx.storage.put<Session>('session', updatedSession);
		this.session = updatedSession;
		return updatedSession;
	}

	async revokeSession(): Promise<Session | undefined> {
		const toBeRevokedSession = await this.ctx.storage.get<Session>('session');
		await this.ctx.storage.delete('session');
		this.session = undefined;
		return toBeRevokedSession;
	}
}
