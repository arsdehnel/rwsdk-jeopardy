import { SyncedStateServer } from 'rwsdk/use-synced-state/worker';
import { createLogger } from '@/logger';
import handleActiveContestant from './handle-active-contestant';
import handleContestantRegistration from './handle-contestant-registration';
import handleDisplayRegistration from './handle-display-registration';
import handleHostRegistration from './handle-host-registration';
import handleScores from './handle-scores';
import handleUsedClues from './handle-used-clues';
export class GameStateSyncDurableObject extends SyncedStateServer {}

GameStateSyncDurableObject.registerSetStateHandler(async (syncStateKey, value) => {
	const [, gameId, key] = syncStateKey.split(':');

	if (!gameId) {
		return;
	}

	const logger = createLogger({ source: 'do-sync', gameId });

	try {
		switch (key) {
			case 'scores':
				await handleScores.set(gameId, value, logger);
				break;
			case 'activeContestantSessionId':
				await handleActiveContestant.set(gameId, value, logger);
				break;
			case 'usedClueIds':
				await handleUsedClues.set(gameId, value, logger);
				break;
			case 'host':
				await handleHostRegistration.set(gameId, value, logger);
				break;
			case 'display':
				await handleDisplayRegistration.set(gameId, value, logger);
				break;
			case 'contestants':
				await handleContestantRegistration.set(gameId, value, logger);
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
