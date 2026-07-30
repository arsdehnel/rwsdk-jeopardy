import { KADRepositoryError, KADRepositoryErrorTypes } from '@/classes';
import db from '@/db';
import { gameStages } from '@/models';
import type { GameStageDBRead, GameStageRepoInput, KADLogger } from '@/types';
import { validateUuid } from './utils';

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
