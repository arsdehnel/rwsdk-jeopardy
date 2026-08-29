import { env } from 'cloudflare:workers';
import { except, prefix, render, route } from 'rwsdk/router';
import { syncedStateRoutes } from 'rwsdk/use-synced-state/worker';
import { type DefaultAppContext, defineApp, type RequestInfo } from 'rwsdk/worker';

import Document from '@/document';
import headersMiddleware from '@/middleware/headers';
import sessionMiddleware from '@/middleware/session';
import adminRoutes from '@/pages/admin/routes';
import authRoutes from '@/pages/auth/routes';
import devRoutes from '@/pages/dev/routes';
import gamesRoutes from '@/pages/games/routes';
import profileRoutes from '@/pages/profile/routes';
import Pages__root from '@/pages/root';
import botMiddleware from './middleware/bot';
import loggerMiddleware from './middleware/logger';
import permissionsMiddleware from './middleware/permissions';
import userMiddleware from './middleware/user';
import Pages__not_found from './pages/not-found';
import { handlePageError } from './worker-error';

export { GameStateSyncDurableObject, SessionDurableObject } from '@/durable-objects';

export default defineApp([
	botMiddleware,
	loggerMiddleware,
	headersMiddleware,
	sessionMiddleware,
	userMiddleware,
	permissionsMiddleware,
	...syncedStateRoutes(() => env.GAME_STATE_SYNC_DURABLE_OBJECT),
	render(Document, [
		except<RequestInfo<DefaultAppContext>>(handlePageError),
		route('/', Pages__root),
		prefix('/admin', adminRoutes.admin),
		prefix('/auth', authRoutes.app),
		prefix('/dev', devRoutes.app),
		prefix('/games', gamesRoutes.app),
		prefix('/profile', profileRoutes.app),
		route('*', Pages__not_found),
	]),
]);
