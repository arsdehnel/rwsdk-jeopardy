import { env } from 'cloudflare:workers';
import { prefix, render, route } from 'rwsdk/router';
import { SyncedStateServer, syncedStateRoutes } from 'rwsdk/use-synced-state/worker';
import { defineApp } from 'rwsdk/worker';

import { Document } from '@/document';
import { Home } from '@/pages/home';
import headerMiddleware from './middleware/headers';
import sessionMiddleware from './middleware/session';
import devRoutes from './pages/dev';
import Game from './pages/game';

export { SyncedStateServer };

export default defineApp([
	...syncedStateRoutes(() => env.SYNCED_STATE_SERVER),
	headerMiddleware,
	sessionMiddleware,
	render(Document, [route('/', Home), route('/games/:gameId', Game), prefix('/dev', devRoutes)]),
]);
