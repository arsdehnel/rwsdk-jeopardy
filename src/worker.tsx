import { env } from 'cloudflare:workers';
import { render, route } from 'rwsdk/router';
import { SyncedStateServer, syncedStateRoutes } from 'rwsdk/use-synced-state/worker';
import { defineApp } from 'rwsdk/worker';

import { Document } from '@/app/document';
import { setCommonHeaders } from '@/app/headers';
import { Home } from '@/app/pages/home';
import Game from './app/pages/game';

export type AppContext = {};
export { SyncedStateServer };

export default defineApp([
	...syncedStateRoutes(() => env.SYNCED_STATE_SERVER),
	setCommonHeaders(),
	({ ctx }) => {
		// setup ctx here
		ctx;
	},
	render(Document, [route('/', Home), route('/games/:gameId', Game)]),
]);
