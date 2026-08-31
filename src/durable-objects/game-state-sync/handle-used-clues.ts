import { updateGame } from '@/repositories';
import { validateUuid } from '@/utils';
import type { KADLogger } from '@/types';

const PUBLIC_STATE_OPERATIONS_USER_ID = 'cf2ef843-8572-45d4-8cb4-4b4b8b621ceb';

async function set(gameId: string, value: unknown, logger: KADLogger): Promise<void> {
	logger.info(`Used Clud IDs change for game ${gameId}: ${JSON.stringify(value)}`);
	if (!value) {
		await updateGame(
			gameId,
			{
				usedClueIds: null,
			},
			PUBLIC_STATE_OPERATIONS_USER_ID,
			logger,
		);
	} else if (!Array.isArray(value)) {
		logger.error(`Active contestant value of unexpected type ${typeof value}`, { value });
	} else if (value.every(clueId => validateUuid(clueId))) {
		await updateGame(
			gameId,
			{
				usedClueIds: value,
			},
			PUBLIC_STATE_OPERATIONS_USER_ID,
			logger,
		);
	} else {
		logger.error('Unexpected used clue IDs value', { value });
	}
}

export default {
	set,
};
