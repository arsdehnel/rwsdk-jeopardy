import { KADRepositoryError, KADRepositoryErrorTypes } from '@/classes';
import db from '@/db';
import { games } from '@/models';
import type { GameDBRead, GameRepoInput, GameWithEverything, KADLogger } from '@/types';
import { validateUuid } from './utils';

export async function createGame(game: GameRepoInput, userId: string, logger: KADLogger): Promise<GameDBRead> {
	logger.info(`Creating new game`);

	const createdGames = await db
		.insert(games)
		.values({
			...game,
			createdBy: userId,
		})
		.returning();

	if (createdGames.length !== 1) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.UnexpectedRecordCount, [createdGames.length, 1, 'Game']);
	}

	return createdGames[0];
}

export async function getGameById(gameId: string, logger: KADLogger): Promise<GameWithEverything> {
	if (!validateUuid(gameId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [gameId, 'Game']);
	}

	logger.debug(`Fetching game ${gameId}`);
	const game = await db.query.games.findFirst({
		where: {
			id: { eq: gameId },
			deletedAt: { isNull: true },
		},
		with: {
			stages: true,
		},
	});

	if (!game) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.UnexpectedRecordCount, [0, 1, 'Game']);
	}

	logger.debug(`Fetched recipe ${gameId}`);
	return game;
}
