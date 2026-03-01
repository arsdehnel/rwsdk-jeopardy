import { env } from 'cloudflare:workers';
import { randomUUID } from 'node:crypto';
import type { DefaultAppContext, RequestInfo } from 'rwsdk/worker';

const COOKIE_NAME = 'RWSDK_JEOPARDY_SESSION';

function getSessionCookie(cookies: string): string | undefined {
	const cookieArray = cookies.split(';').map(cookie => cookie.trim());
	for (const cookie of cookieArray) {
		if (cookie.startsWith(`${COOKIE_NAME}=`)) {
			console.log(`Found session cookie: ${cookie}`);
			return cookie.substring(`${COOKIE_NAME}=`.length);
		}
	}
	return undefined;
}

export default async function sessionMiddleware(requestInfo: RequestInfo<DefaultAppContext>) {
	const { ctx, request, response } = requestInfo;

	const useSecureCookie = env.RWSDK_JEOPARDY_ENV !== 'development';
	const sessionCookie = getSessionCookie(request.headers.get('Cookie') || '');
	console.log(`Session Cookie: ${sessionCookie}`);
	if (sessionCookie) {
		ctx.session = { cookieId: sessionCookie, createdAt: Date.now(), lastAccessedAt: Date.now() };
	}
	if (!sessionCookie) {
		response.headers.set('Set-Cookie', `${COOKIE_NAME}=${randomUUID()}; Path=/; ${useSecureCookie ? 'Secure; ' : ''}`);
	}
}
