import { updateGame } from '@/repositories';
import type { KADLogger } from '@/types';
import { validateUuid } from '@/utils';

const PUBLIC_STATE_OPERATIONS_USER_ID = 'cf2ef843-8572-45d4-8cb4-4b4b8b621ceb';

async function set(gameId: string, value: unknown, logger: KADLogger): Promise<void> {
	logger.info(`Active contestant change for game ${gameId}: ${JSON.stringify(value)}`);
	if (!value) {
		await updateGame(
			gameId,
			{
				activeContestantSessionId: null,
			},
			PUBLIC_STATE_OPERATIONS_USER_ID,
			logger,
		);
	} else if (typeof value !== 'string') {
		logger.error(`Active contestant value of unexpected type ${typeof value}`, { value });
	} else if (validateUuid(value)) {
		await updateGame(
			gameId,
			{
				activeContestantSessionId: value,
			},
			PUBLIC_STATE_OPERATIONS_USER_ID,
			logger,
		);
	} else {
		logger.error('Unexpected active contestant value', { value });
	}
}

export default {
	set,
};
