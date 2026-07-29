import { env } from 'cloudflare:workers';
import { except, prefix, render, route } from 'rwsdk/router';
import { SyncedStateServer, syncedStateRoutes } from 'rwsdk/use-synced-state/worker';
import { type DefaultAppContext, defineApp, type RequestInfo } from 'rwsdk/worker';

import Document from '@/document';
import headersMiddleware from '@/middleware/headers';
import sessionMiddleware from '@/middleware/session';
import authRoutes from '@/pages/auth/routes';
import devRoutes from '@/pages/dev';
import Pages__Games__New from '@/pages/games/new';
import Pages__Games__Play from '@/pages/games/play';
import Pages__Home from '@/pages/home';
import botMiddleware from './middleware/bot';
import loggerMiddleware from './middleware/logger';
import permissionsMiddleware from './middleware/permissions';
import userMiddleware from './middleware/user';
import Pages__not_found from './pages/not-found';
import { handlePageError } from './worker-error';

export { SessionDurableObject } from '@/durable-objects/sessions';
export { SyncedStateServer };

export default defineApp([
	botMiddleware,
	loggerMiddleware,
	headersMiddleware,
	sessionMiddleware,
	userMiddleware,
	permissionsMiddleware,
	...syncedStateRoutes(() => env.SYNCED_STATE_SERVER),
	render(Document, [
		except<RequestInfo<DefaultAppContext>>(handlePageError),
		route('/', Pages__Home),
		prefix('/auth', authRoutes),
		route('/games/new', Pages__Games__New),
		route('/games/:gameId', Pages__Games__Play),
		prefix('/dev', devRoutes),
		route('*', Pages__not_found),
	]),
]);
