import { getRequestInfo } from 'rwsdk/worker';
import { KADAccessError } from '@/classes';
import type { Permission } from '@/types';

export const requirePermissions = (...required: Permission[]): (() => Promise<void>) => {
	if (!required || required.length === 0) {
		throw new KADAccessError(500, `Required permission check requires at least one permission`);
	}
	return async () => {
		const { ctx } = getRequestInfo();
		const missing = required.filter(p => !ctx.permissions?.includes(p));

		if (missing.length > 0) {
			throw new KADAccessError(403, 'Forbidden');
		}
	};
};
