import { createGameStage, updateGameStage } from '@/repositories';
import type { GameStageDBRead, GameStageRepoInput, KADLogger } from '@/types';

export async function saveGameStages(
	gameId: string,
	stages: GameStageRepoInput[],
	userId: string,
	logger: KADLogger,
): Promise<GameStageDBRead[]> {
	logger.debug(`Updating game stages for game ${gameId}`);

	const returnedStages = [];

	for (const stage of stages) {
		if (stage.id) {
			const updatedStage = await updateGameStage(stage.id, stage, userId, logger);
			returnedStages.push(updatedStage);
		} else {
			const newStage = await createGameStage(stage, gameId, userId, logger);
			returnedStages.push(newStage);
		}
	}

	logger.info(`Updated ${returnedStages.length} stages for game ${gameId}`);

	return returnedStages;
}
