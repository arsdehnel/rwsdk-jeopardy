import type { RequestInfo } from 'rwsdk/worker';
import { sessions } from '@/durable-objects';

export default async function ensureSession({ ctx, request, response }: RequestInfo): Promise<void> {
	if (!ctx.session) {
		await sessions.save(response.headers, { userId: null, challenge: null });
		const setCookie = response.headers.get('Set-Cookie');
		const cookieValue = setCookie?.match(/session_id=([^;]+)/)?.[1];
		const syntheticRequest = new Request(request.url, {
			headers: cookieValue ? { Cookie: `session_id=${cookieValue}` } : {},
		});
		ctx.session = await sessions.load(syntheticRequest);
	}
}
