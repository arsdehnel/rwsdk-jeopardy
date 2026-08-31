import { updateGame } from '@/repositories';
import type { HostRegistration, KADLogger } from '@/types';

const PUBLIC_STATE_OPERATIONS_USER_ID = 'cf2ef843-8572-45d4-8cb4-4b4b8b621ceb';

function isHostRegistration(v: unknown): v is NonNullable<HostRegistration> {
	if (typeof v !== 'object' || v === null) return false;
	const r = v as Record<string, unknown>;
	return typeof r.sessionId === 'string' && typeof r.userId === 'string';
}

async function set(gameId: string, value: unknown, logger: KADLogger): Promise<void> {
	if (!value) {
		await updateGame(gameId, { hostUserId: null }, PUBLIC_STATE_OPERATIONS_USER_ID, logger);
	} else if (isHostRegistration(value)) {
		await updateGame(gameId, { hostUserId: value.userId }, value.userId, logger);
	} else {
		logger.error('Unexpected host value', { value });
	}
}

export default {
	set,
};
