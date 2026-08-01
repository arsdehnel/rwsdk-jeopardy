import { route } from 'rwsdk/router';
import { requireAuthentication, requirePermissions } from '@/interrupters';
import Pages__Games__Edit from './edit';
import Pages__Games__Listing from './listing';
import Pages__Games__New from './new';
import Pages__Games__Play from './play';

export default [
	route('/listing', [requireAuthentication, requirePermissions('games:read'), Pages__Games__Listing]),
	route('/new', [requireAuthentication, requirePermissions('games:create'), Pages__Games__New]),
	route('/play', [requireAuthentication, requirePermissions('games:read'), Pages__Games__Play]),
	route('/:gameId/edit', [requireAuthentication, requirePermissions('games:update'), Pages__Games__Edit]),
];
