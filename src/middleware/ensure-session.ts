import type { RequestInfo } from 'rwsdk/worker';
import { sessions } from '@/durable-objects';

export default async function ensureSession({ ctx, request, response }: RequestInfo): Promise<void> {
	if (!ctx.session) {
		await sessions.save(response.headers, { userId: null, challenge: null });
		ctx.session = await sessions.load(request);
	}
}
