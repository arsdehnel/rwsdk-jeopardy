import { SyncedStateServer } from 'rwsdk/use-synced-state/worker';
import { createLogger } from '@/logger';
import { saveGameContestants, updateGame } from '@/repositories';
import { isDisplayRegistration, isGameContestants, isHostRegistration } from '@/types';

export class GameStateSyncDurableObject extends SyncedStateServer {}

const PUBLIC_STATE_OPERATIONS_USER_ID = 'cf2ef843-8572-45d4-8cb4-4b4b8b621ceb';

GameStateSyncDurableObject.registerSetStateHandler(async (syncStateKey, value) => {
	const [, gameId, key] = syncStateKey.split(':');

	if (!gameId) {
		return;
	}

	const logger = createLogger({ source: 'do-sync', gameId });

	try {
		switch (key) {
			case 'host':
				if (!value) {
					await updateGame(gameId, { hostUserId: null }, PUBLIC_STATE_OPERATIONS_USER_ID, logger);
				} else if (isHostRegistration(value)) {
					await updateGame(gameId, { hostUserId: value.userId }, value.userId, logger);
				} else {
					logger.error('Unexpected host value', { value });
				}
				break;
			case 'display':
				if (!value) {
					await updateGame(gameId, { displaySessionId: null }, PUBLIC_STATE_OPERATIONS_USER_ID, logger);
				} else if (isDisplayRegistration(value)) {
					await updateGame(
						gameId,
						{ displaySessionId: value.sessionId },
						value.userId ?? PUBLIC_STATE_OPERATIONS_USER_ID,
						logger,
					);
				} else {
					logger.error('Unexpected host value', { value });
				}
				break;
			case 'contestants':
				if (isGameContestants(value)) {
					await saveGameContestants(gameId, value, PUBLIC_STATE_OPERATIONS_USER_ID, logger);
				} else {
					logger.error('Unexpected contestants value', { value });
				}
				break;
			default:
				// biome-ignore lint/suspicious/noConsole: short term while we do some logging
				console.log(`Unhandled state key update ${key}: ${JSON.stringify({ gameId, value }, null, 4)}`);
				break;
		}
	} catch (err) {
		logger.error(`Error updating DB with game state: ${err}`);
	}
});

GameStateSyncDurableObject.registerGetStateHandler((key, value) => {
	// biome-ignore lint/suspicious/noConsole: short term while we do some logging
	console.log('State read:', key, value);
});
