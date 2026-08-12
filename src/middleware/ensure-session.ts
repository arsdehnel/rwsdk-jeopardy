import type { RequestInfo } from 'rwsdk/worker';
import { sessions } from '@/durable-objects';

export default async function ensureSession({ ctx, response }: RequestInfo): Promise<void> {
	if (!ctx.session) {
		ctx.session = await sessions.upsert(null, response.headers, {});
	}
}
