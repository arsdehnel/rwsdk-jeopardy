import { updateGame } from '@/repositories';
import type { DisplayRegistration, KADLogger } from '@/types';

const PUBLIC_STATE_OPERATIONS_USER_ID = 'cf2ef843-8572-45d4-8cb4-4b4b8b621ceb';

function isDisplayRegistration(v: unknown): v is NonNullable<DisplayRegistration> {
	if (typeof v !== 'object' || v === null) return false;
	const r = v as Record<string, unknown>;
	return typeof r.sessionId === 'string';
}

async function set(gameId: string, value: unknown, logger: KADLogger): Promise<void> {
	if (!value) {
		await updateGame(gameId, { displaySessionId: null }, PUBLIC_STATE_OPERATIONS_USER_ID, logger);
	} else if (isDisplayRegistration(value)) {
		await updateGame(gameId, { displaySessionId: value.sessionId }, value.userId ?? PUBLIC_STATE_OPERATIONS_USER_ID, logger);
	} else {
		logger.error('Unexpected host value', { value });
	}
}

export default {
	set,
};
