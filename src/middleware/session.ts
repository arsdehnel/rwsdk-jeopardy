import type { DefaultAppContext, RequestInfo } from 'rwsdk/worker';
import { sessions } from '@/durable-objects';

export default async function sessionMiddleware({ ctx, request, response }: RequestInfo<DefaultAppContext>): Promise<void> {
	try {
		ctx.session = await sessions.loadFromRequest(request, response.headers);
	} catch (error) {
		ctx.logger.error(`Uncaught session loading error: ${JSON.stringify(error)}`);
	}
}
