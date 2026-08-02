import { env } from 'cloudflare:workers';
import type { ActionState } from '@/types';

/**
 * Builds a human-readable error message that walks the full cause chain.
 * Use this in client-facing error responses in non-production environments
 * so that underlying SQLite / Drizzle errors are visible.
 */
export function buildDevErrorMessage(err: unknown): string {
	if (!(err instanceof Error)) return String(err);
	const parts: string[] = [err.message];
	let cause: unknown = err.cause;
	while (cause instanceof Error) {
		parts.push(cause.message);
		cause = cause.cause;
	}
	if (cause !== undefined) {
		parts.push(String(cause));
	}
	return parts.join(' → ');
}

export function errorResponse<T>(
	errors: string | Record<string, string[]> | unknown,
	status: number = 400,
	prodErrorMessage?: string,
): ActionState<T> {
	if (env.RWSDK_JEOPARDY_ENV === 'production') {
		return { success: false, code: status, errors: { _form: [prodErrorMessage ?? 'An error occurred'] } };
	}

	// Field-level errors from Zod validation — pass through directly
	if (typeof errors === 'object' && errors !== null && !(errors instanceof Error)) {
		return { success: false, code: status, errors: errors as Record<string, string[]> };
	}

	const message = errors instanceof Error ? buildDevErrorMessage(errors) : String(errors);
	return { success: false, code: status, errors: { _form: [message] } };
}

export function successResponse<T>(data: T, status: number = 200): ActionState<T> {
	return {
		success: true,
		code: status,
		data,
	};
}

export function getWebAuthnConfig(request: Request): { rpName: string; rpID: string; origin: string } {
	const rpID = new URL(request.url).hostname;
	const rpName = import.meta.env.VITE_IS_DEV_SERVER ? 'Development App' : env.WEBAUTHN_APP_NAME;

	const url = new URL(request.url);
	// Cloudflare (production) and tunnel (dev) both terminate TLS before the Worker.
	// wrangler dev reports http:// in req.url even when the tunnel provides HTTPS,
	// so force https for any non-localhost host to match what the browser actually sees.
	const origin = url.hostname.includes('localhost') || url.hostname === '127.0.0.1' ? url.origin : `https://${url.host}`;

	return {
		rpName,
		rpID,
		origin,
	};
}
