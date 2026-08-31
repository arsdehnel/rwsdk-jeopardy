import { updateContestantScores } from '@/repositories';
import type { KADLogger } from '@/types';

const PUBLIC_STATE_OPERATIONS_USER_ID = 'cf2ef843-8572-45d4-8cb4-4b4b8b621ceb';

function isScores(v: unknown): v is Record<string, number> {
	if (typeof v !== 'object' || v === null || Array.isArray(v)) return false;
	return Object.values(v as Record<string, unknown>).every(val => typeof val === 'number');
}

async function set(gameId: string, value: unknown, logger: KADLogger): Promise<void> {
	logger.info(`Score change for game ${gameId}: ${JSON.stringify(value)}`);
	if (isScores(value)) {
		await updateContestantScores(gameId, value, PUBLIC_STATE_OPERATIONS_USER_ID, logger);
	} else {
		logger.error('Unexpected scores value', { value });
	}
}

export default {
	set,
};
