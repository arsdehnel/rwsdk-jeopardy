import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { KADRepositoryError, KADRepositoryErrorTypes } from '@/classes';
import db from '@/db';
import { gameStages } from '@/models';
import type { GameStageDBRead, GameStageRepoInput, KADLogger } from '@/types';
import { validateUuid } from '@/utils';

export async function createGameStage(
	gameStage: GameStageRepoInput,
	gameId: string,
	userId: string,
	logger: KADLogger,
): Promise<GameStageDBRead> {
	if (!validateUuid(gameId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [gameId, 'Game']);
	}
	logger.info(`Creating new game stage`);

	const createdGameStages = await db
		.insert(gameStages)
		.values({
			...gameStage,
			gameId,
			createdBy: userId,
		})
		.returning();

	if (createdGameStages.length !== 1) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.UnexpectedRecordCount, [createdGameStages.length, 1, 'Game Stage']);
	}

	return createdGameStages[0];
}

export async function updateGameStage(
	gameStageId: string,
	gameStage: GameStageRepoInput,
	userId: string,
	logger: KADLogger,
): Promise<GameStageDBRead> {
	if (!validateUuid(gameStageId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [gameStageId, 'Game Stage']);
	}

	logger.info(`Updating game stage ${gameStageId}`);

	const updatedGameStages = await db
		.update(gameStages)
		.set({
			...gameStage,
			updatedBy: userId,
		})
		.where(eq(gameStages.id, gameStageId))
		.returning();

	if (updatedGameStages.length !== 1) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.UnexpectedRecordCount, [updatedGameStages.length, 1, 'Game Stage']);
	}

	return updatedGameStages[0];
}
