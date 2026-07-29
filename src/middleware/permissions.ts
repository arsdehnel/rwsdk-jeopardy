import type { DefaultAppContext, RequestInfo } from 'rwsdk/worker';
import { flattenedPermissions } from '@/data/permissions';
import type { PermissionRole } from '@/data/roles';

export default function permissionsMiddleware({ ctx }: RequestInfo<DefaultAppContext>): void {
	if (
		ctx.session?.permissionsOverride &&
		Array.isArray(ctx.session.permissionsOverride) &&
		ctx.session?.permissionsOverride.length > 0
	) {
		ctx.permissions = ctx.session.permissionsOverride;
		return;
	}

	let role: PermissionRole = 'PUBLIC';
	if (ctx.user?.role) {
		role = ctx.user.role;
	}
	ctx.permissions = flattenedPermissions.filter(p => p.roles.includes('*') || p.roles.includes(role)).map(p => p.permission);
}
