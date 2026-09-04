import { route } from 'rwsdk/router';
import { requireAuthentication, requirePermissions } from '@/interrupters';
import ensureSession from '@/middleware/ensure-session';
import Pages__Games__Listing from './listing';
import Pages__Games__New from './new';
import Pages__Games__Play from './play';
import Pages__Games__Register from './register';
import Pages__games__setup from './setup';
import Pages__games__view from './view';

export default {
	app: [
		route('/listing', [requireAuthentication, requirePermissions('games:read'), Pages__Games__Listing]),
		route('/new', [requireAuthentication, requirePermissions('games:create'), Pages__Games__New]),
		route('/:gameId/play', [ensureSession, requirePermissions('games:read'), Pages__Games__Play]),
		route('/:gameId/setup', [requireAuthentication, requirePermissions('games:update'), Pages__games__setup]),
		route('/:gameId/view', [requireAuthentication, requirePermissions('games:update'), Pages__games__view]),
		route('/:gameId/register', [ensureSession, requirePermissions('games:read'), Pages__Games__Register]),
	],
};
