import { getGameById } from '@/repositories';
import type { GamePhaseEnum, KADLogger } from '@/types';

async function get(gameId: string, logger: KADLogger): Promise<GamePhaseEnum> {
	logger.info(`Looking for game phase initial value for game ${gameId}`);
	const game = await getGameById(gameId, logger);
	return game.phase;
}

export default {
	get,
};
