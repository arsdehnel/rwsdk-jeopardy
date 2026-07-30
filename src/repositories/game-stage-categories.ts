import { KADRepositoryError, KADRepositoryErrorTypes } from '@/classes';
import db from '@/db';
import { gameStageCategories } from '@/models';
import type { GameStageCategoryDBRead, GameStageCategoryRepoInput, KADLogger } from '@/types';
import { validateUuid } from './utils';

export async function createGameStageCategory(
	gameStageCategory: GameStageCategoryRepoInput,
	gameStageId: string,
	userId: string,
	logger: KADLogger,
): Promise<GameStageCategoryDBRead> {
	if (!validateUuid(gameStageId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [gameStageId, 'Game Stage']);
	}
	logger.info(`Creating new game stage category`);

	const createdGameStages = await db
		.insert(gameStageCategories)
		.values({
			...gameStageCategory,
			gameStageId,
			createdBy: userId,
		})
		.returning();

	if (createdGameStages.length !== 1) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.UnexpectedRecordCount, [
			createdGameStages.length,
			1,
			'Game Stage Category',
		]);
	}

	return createdGameStages[0];
}
