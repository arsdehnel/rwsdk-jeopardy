import type { DefaultAppContext, RequestInfo } from 'rwsdk/worker';
import { sessions } from '@/durable-objects';

export default async function sessionMiddleware({ ctx, request, response }: RequestInfo<DefaultAppContext>): Promise<void> {
	try {
		ctx.session = await sessions.loadFromRequest(request, response.headers);
		// biome-ignore lint/suspicious/noConsole: temporary exception during debugging new sessions
		console.log(`CTX session: ${JSON.stringify(ctx.session)}`);
	} catch (error) {
		ctx.logger.error(`Uncaught session loading error: ${JSON.stringify(error)}`);
	}
}
