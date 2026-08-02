import { env } from 'cloudflare:workers';
import { except, prefix, render, route } from 'rwsdk/router';
import { SyncedStateServer, syncedStateRoutes } from 'rwsdk/use-synced-state/worker';
import { type DefaultAppContext, defineApp, type RequestInfo } from 'rwsdk/worker';

import Document from '@/document';
import headersMiddleware from '@/middleware/headers';
import sessionMiddleware from '@/middleware/session';
import authRoutes from '@/pages/auth/routes';
import gamesRoutes from '@/pages/games/routes';
import Pages__Home from '@/pages/home';
import profileRoutes from '@/pages/profile/routes';
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
		prefix('/profile', profileRoutes),
		prefix('/games', gamesRoutes),
		route('*', Pages__not_found),
	]),
]);
