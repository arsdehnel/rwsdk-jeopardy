import { and, eq, isNull, sql } from 'drizzle-orm';
import { KADRepositoryError, KADRepositoryErrorTypes } from '@/classes';
import db from '@/db';
import { games } from '@/models';
import type { GameDBRead, GameRepoInput, GameWithEverything, KADLogger } from '@/types';
import { streamlineError, validateUuid } from './utils';

export async function createGame(game: GameRepoInput, userId: string, logger: KADLogger): Promise<GameDBRead> {
	logger.info(`Creating new game`);

	const createdGames = await db
		.insert(games)
		.values({
			...game,
			ownerId: userId,
			createdBy: userId,
		})
		.returning();

	if (createdGames.length !== 1) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.UnexpectedRecordCount, [createdGames.length, 1, 'Game']);
	}

	return createdGames[0];
}

export async function updateGame(
	gameId: string,
	game: Partial<GameRepoInput>,
	userId: string,
	logger: KADLogger,
): Promise<GameDBRead> {
	if (!validateUuid(gameId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [gameId, 'Game']);
	}

	if (!validateUuid(userId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [userId, 'User ID']);
	}

	if (game.hostUserId && !validateUuid(game.hostUserId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [game.hostUserId, 'Host']);
	}

	logger.info(`Updating game ${gameId}: ${JSON.stringify(game, null, 4)}`);
	let updatedGame: GameDBRead | undefined;
	try {
		const updatedGames = await db
			.update(games)
			.set({
				...game,
				updatedAt: sql`(datetime('now', 'localtime'))`,
				updatedBy: userId,
			})
			.where(eq(games.id, gameId))
			.returning();
		updatedGame = updatedGames[0];
	} catch (err) {
		const { message, error } = streamlineError(err);
		logger.error(`Error updating game ${gameId}${message}`, { err: error });
		throw error;
	}

	if (!updatedGame) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.UnexpectedRecordCount, [0, 1, 'Game']);
	}

	logger.info(`Game ${gameId} updated successfully: ${JSON.stringify(updatedGame, null, 4)}`);

	return updatedGame;
}

export async function getGameById(gameId: string, logger: KADLogger): Promise<GameWithEverything> {
	if (!validateUuid(gameId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [gameId, 'Game']);
	}

	logger.debug(`Fetching game ${gameId}`);
	let game: GameWithEverything | undefined;
	try {
		game = await db.query.games.findFirst({
			where: {
				id: { eq: gameId },
				deletedAt: { isNull: true },
			},
			with: {
				stages: {
					with: {
						categories: true,
					},
				},
				contestants: true,
			},
		});
	} catch (err) {
		const { message, error } = streamlineError(err);
		logger.error(`Error fetching game ${gameId}${message}`, { err: error });
		throw error;
	}

	if (!game) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.UnexpectedRecordCount, [0, 1, 'Game']);
	}

	logger.debug(`Fetched game ${gameId}`);
	return game;
}

export async function deleteGame(gameId: string, userId: string, logger: KADLogger): Promise<GameDBRead> {
	if (!validateUuid(gameId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [gameId, 'Game']);
	}

	logger.debug(`Deleting game ${gameId}`);
	const deleted = await db
		.update(games)
		.set({ deletedAt: sql`(datetime('now', 'localtime'))`, deletedBy: userId })
		.where(eq(games.id, gameId))
		.returning();

	if (deleted.length !== 1) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.UnexpectedRecordCount, [deleted.length, 1, 'Game']);
	}

	logger.info(`Deleted game ${gameId}`);
	return deleted[0];
}

export async function getGamesByOwnerId(ownerId: string, logger: KADLogger): Promise<GameDBRead[]> {
	logger.debug(`Fetching all games owned by ${ownerId}`);

	return await db
		.select()
		.from(games)
		.where(and(eq(games.ownerId, ownerId), isNull(games.deletedAt)));
}
