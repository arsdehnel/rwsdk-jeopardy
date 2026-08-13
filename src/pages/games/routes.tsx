import { route } from 'rwsdk/router';
import { requireAuthentication, requirePermissions } from '@/interrupters';
import ensureSession from '@/middleware/ensure-session';
import Pages__Games__Edit from './edit';
import Pages__Games__Listing from './listing';
import Pages__Games__New from './new';
import Pages__Games__Play from './play';
import Pages__Games__Registration from './registration';

export default [
	route('/listing', [requireAuthentication, requirePermissions('games:read'), Pages__Games__Listing]),
	route('/new', [requireAuthentication, requirePermissions('games:create'), Pages__Games__New]),
	route('/:gameId/play', [ensureSession, requirePermissions('games:read'), Pages__Games__Play]),
	route('/:gameId/edit', [requireAuthentication, requirePermissions('games:update'), Pages__Games__Edit]),
	route('/:gameId/registration', [ensureSession, requirePermissions('games:read'), Pages__Games__Registration]),
];
