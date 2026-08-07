import type { Permission } from '@/types/permissions';
import type { PermissionRole } from './roles';

type RoleEntry = PermissionRole | '*';

// biome-ignore lint/nursery/useExplicitType: This is a constant and a data source/inference source for other types so we can't type this without causing problems in those
const permissions = {
	// this is here to allow our "fully public" items to have a permission to use so we can force all links and actions to have a permission
	// but those that don't actually need to be protected can use this
	__controls: {
		read: ['*'],
	},
	auth: {
		login: ['PUBLIC'],
		logout: ['ADMIN', 'BASIC'],
	},
	credentials: {
		read: ['BASIC', 'ADMIN'],
	},
	categories: {
		read: ['*'],
		create: ['ADMIN'],
		update: ['ADMIN'],
		delete: ['ADMIN'],
		generate: ['BASIC'],
		admin: ['ADMIN'],
	},
	clues: {
		admin: ['ADMIN'],
	},
	games: {
		read: ['*'],
		create: ['BASIC', 'ADMIN'],
		update: ['BASIC', 'ADMIN'],
		register: ['*'],
		unregister: ['*'],
	},
	profile: {
		read: ['ADMIN', 'BASIC'],
	},
	verifications: {
		read: ['ADMIN'],
		create: ['ADMIN'],
		update: ['ADMIN'],
		delete: ['ADMIN'],
	},
} as const satisfies Record<string, Record<string, RoleEntry[]>>;

export default permissions;

export const flattenedPermissions: Array<{ permission: Permission; roles: string[] }> = Object.entries(permissions).flatMap(
	([resource, actions]) =>
		Object.entries(actions).map(([action, roles]) => ({
			permission: `${resource}:${action}` as Permission,
			roles: roles as string[],
		})),
);

export const permissionValues = Object.entries(permissions).flatMap(([resource, actions]) =>
	Object.keys(actions).map(action => `${resource}:${action}`),
) as [Permission, ...Permission[]];
