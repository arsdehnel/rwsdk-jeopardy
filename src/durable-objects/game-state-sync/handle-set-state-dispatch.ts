import { createLogger } from '@/logger';
import handleActiveContestant from './handle-active-contestant';
import handleContestantRegistrations from './handle-contestant-registrations';
import handleDisplayRegistration from './handle-display-registration';
import handleHostRegistration from './handle-host-registration';
import handleScores from './handle-scores';
import handleUsedClues from './handle-used-clues';

export async function handleSetState(syncStateKey: string, value: unknown): Promise<void> {
	const [, gameId, key] = syncStateKey.split(':');

	if (!gameId) {
		return;
	}

	const logger = createLogger({ source: 'do-sync', gameId, stateKey: key });

	try {
		switch (key) {
			case 'activeContestantSessionId':
				await handleActiveContestant.set(gameId, value, logger);
				break;
			case 'contestants':
				await handleContestantRegistrations.set(gameId, value, logger);
				break;
			case 'display':
				await handleDisplayRegistration.set(gameId, value, logger);
				break;
			case 'host':
				await handleHostRegistration.set(gameId, value, logger);
				break;
			case 'scores':
				await handleScores.set(gameId, value, logger);
				break;
			case 'usedClueIds':
				await handleUsedClues.set(gameId, value, logger);
				break;
			default:
				// biome-ignore lint/suspicious/noConsole: short term while we do some logging
				console.log(`Unhandled state key update ${key}: ${JSON.stringify({ gameId, value }, null, 4)}`);
				break;
		}
	} catch (err) {
		logger.error(`Error updating DB with game state ${syncStateKey}: ${err}`);
	}
}
