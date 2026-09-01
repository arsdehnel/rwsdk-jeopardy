import { getGameById, saveGameContestants } from '@/repositories';
import type { ContestantRegistration, GameContestantDBRead, KADLogger } from '@/types';

const PUBLIC_STATE_OPERATIONS_USER_ID = 'cf2ef843-8572-45d4-8cb4-4b4b8b621ceb';

function isGameContestants(v: unknown): v is ContestantRegistration[] {
	if (!Array.isArray(v)) return false;
	return v.every(item => {
		if (typeof item !== 'object' || item === null) return false;
		const r = item as Record<string, unknown>;
		return (
			typeof r.sessionId === 'string' &&
			typeof r.name === 'string' &&
			(r.id === undefined || typeof r.id === 'string') &&
			(r.userId === undefined || typeof r.userId === 'string')
		);
	});
}

async function set(gameId: string, value: unknown, logger: KADLogger): Promise<void> {
	if (isGameContestants(value)) {
		await saveGameContestants(gameId, value, PUBLIC_STATE_OPERATIONS_USER_ID, logger);
	} else {
		logger.error('Unexpected contestants value', { value });
	}
}

async function get(gameId: string, logger: KADLogger): Promise<GameContestantDBRead[]> {
	logger.info(`Looking for game contestants value for game ${gameId}`);
	const game = await getGameById(gameId, logger);
	return game.contestants;
}

export default {
	get,
	set,
};
