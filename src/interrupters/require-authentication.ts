import { getRequestInfo } from 'rwsdk/worker';
import { KADAccessError } from '@/classes';

export function requireAuthentication(): void {
	const { ctx } = getRequestInfo();
	if (!ctx.user) {
		throw new KADAccessError(401, 'Authentication required');
	}
}
