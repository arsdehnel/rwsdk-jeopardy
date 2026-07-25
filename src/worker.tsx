import { env } from 'cloudflare:workers';
import { prefix, render, route } from 'rwsdk/router';
import { SyncedStateServer, syncedStateRoutes } from 'rwsdk/use-synced-state/worker';
import { defineApp } from 'rwsdk/worker';

import { Document } from '@/document';
import headerMiddleware from '@/middleware/headers';
import sessionMiddleware from '@/middleware/session';
import devRoutes from '@/pages/dev';
import Pages__Games__New from '@/pages/games/new';
import Pages__Games__Play from '@/pages/games/play';
import Pages__Home from '@/pages/home';

export { SyncedStateServer };

export default defineApp([
	...syncedStateRoutes(() => env.SYNCED_STATE_SERVER),
	headerMiddleware,
	sessionMiddleware,
	render(Document, [
		route('/', Pages__Home),
		route('/games/new', Pages__Games__New),
		route('/games/:gameId', Pages__Games__Play),
		prefix('/dev', devRoutes),
	]),
]);
