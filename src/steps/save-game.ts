import { KADStepError } from '@/classes';
import { createGame, updateGame } from '@/repositories';
import type { GameDBRead, GameRepoInput, KADLogger } from '@/types';

export async function saveGame(gameData: GameRepoInput, userId: string, logger: KADLogger): Promise<GameDBRead> {
	let recipe: GameDBRead;
	try {
		if (gameData.id) {
			recipe = await updateGame(gameData.id, gameData, userId, logger);
		} else {
			recipe = await createGame(gameData, userId, logger);
		}
		logger.info(`Game ${recipe.id} saved`);
	} catch (error) {
		logger.warn(`Error saving game: ${error}`);
		throw new KADStepError(400, 'Failed to save game', `Error saving game: ${error}`, false, error);
	}
	return recipe;
}
