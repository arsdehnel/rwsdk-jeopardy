import { createLogger } from '@/logger';
import handleActiveContestant from './handle-active-contestant';
import handleContestantRegistrations from './handle-contestant-registrations';
import handleDisplayRegistration from './handle-display-registration';
import handleGamePhase from './handle-game-phase';
import handleHostRegistration from './handle-host-registration';
import handleScores from './handle-scores';
import handleUsedClues from './handle-used-clues';

type SyncedStateStub = {
	setState: (value: unknown, key: string) => Promise<void>;
};

export async function handleGetState(syncStateKey: string, value: unknown, stub: SyncedStateStub): Promise<void> {
	if (value !== undefined) {
		return;
	}

	const [, gameId, key] = syncStateKey.split(':');

	if (!gameId) {
		return;
	}

	const logger = createLogger({ source: 'do-sync', gameId, stateKey: key });

	let stateValue: unknown;

	try {
		switch (key) {
			case 'activeContestantSessionId':
				stateValue = await handleActiveContestant.get(gameId, logger);
				break;
			case 'contestants':
				stateValue = await handleContestantRegistrations.get(gameId, logger);
				break;
			case 'display':
				stateValue = await handleDisplayRegistration.get(gameId, logger);
				break;
			case 'gamePhase':
				stateValue = await handleGamePhase.get(gameId, logger);
				break;
			case 'host':
				stateValue = await handleHostRegistration.get(gameId, logger);
				break;
			case 'scores':
				stateValue = await handleScores.get(gameId, logger);
				break;
			case 'usedClueIds':
				stateValue = await handleUsedClues.get(gameId, logger);
				break;
			default:
				// biome-ignore lint/suspicious/noConsole: short term while we do some logging
				console.log(`Unhandled state key lookup ${key}: ${JSON.stringify({ gameId, value }, null, 4)}`);
				break;
		}
		if (stateValue !== undefined) {
			await stub.setState(stateValue, syncStateKey);
		}
	} catch (err) {
		logger.error(`Error seeding state ${syncStateKey} with DB value: ${err}`);
	}
}
