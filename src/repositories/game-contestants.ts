import { and, eq, isNull, sql } from 'drizzle-orm';
import { KADRepositoryError, KADRepositoryErrorTypes } from '@/classes';
import db from '@/db';
import { gameContestants } from '@/models';
import type { ContestantRegistration, GameContestantDBRead, KADLogger } from '@/types';
import { validateUuid } from '@/utils';
import { streamlineError } from './utils';

export async function saveGameContestants(
	gameId: string,
	contestants: ContestantRegistration[],
	userId: string,
	logger: KADLogger,
): Promise<GameContestantDBRead[]> {
	if (!validateUuid(gameId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [gameId, 'Game']);
	}

	if (contestants.some(c => !validateUuid(c.sessionId))) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [gameId, 'Game Contestant']);
	}

	logger.info(`Incoming sessions for game ${gameId}: ${contestants.map(c => c.sessionId).join(', ')}`);
	logger.info(`Looking up existing contestants for ${gameId}`);

	const existingContestants = await db
		.select()
		.from(gameContestants)
		.where(and(eq(gameContestants.gameId, gameId), isNull(gameContestants.deletedAt)));

	logger.info(`Existing sessions for game ${gameId}: ${existingContestants.map(c => c.sessionId).join(', ')}`);
	logger.info(`Saving contestants for game ${gameId}`);

	const contestantsToBeRemoved = existingContestants.filter(
		c => !contestants.some(incoming => incoming.sessionId === c.sessionId),
	);

	try {
		await Promise.all(
			contestantsToBeRemoved.map(async removal => {
				await db.delete(gameContestants).where(eq(gameContestants.sessionId, removal.sessionId));
			}),
		);
	} catch (err) {
		const { message, error } = streamlineError(err);
		logger.error(`Error removing existing contestants ${gameId}${message}`, { err: error });
		throw error;
	}

	let savedContestants: GameContestantDBRead[] = [];
	try {
		savedContestants = await Promise.all(
			contestants.map(async c => {
				const existingRec = existingContestants.find(e => e.sessionId === c.sessionId);
				if (existingRec) {
					const updatedContestant = await db
						.update(gameContestants)
						.set({
							sessionId: c.sessionId,
							name: c.name,
							userId: c.userId,
							updatedAt: sql`(datetime('now', 'localtime'))`,
							updatedBy: userId,
						})
						.where(eq(gameContestants.id, existingRec.id))
						.returning();
					logger.info(`Updated session ${c.sessionId} in ${gameId}`);
					return updatedContestant[0];
				} else {
					const createdContestant = await db
						.insert(gameContestants)
						.values({
							gameId,
							sessionId: c.sessionId,
							name: c.name,
							userId: c.userId,
							createdBy: userId,
						})
						.returning();
					logger.info(`Created session ${c.sessionId} in ${gameId}`);
					return createdContestant[0];
				}
			}),
		);
	} catch (err) {
		const { message, error } = streamlineError(err);
		logger.error(`Error saving contestants ${gameId}${message}`, { err: error });
		throw error;
	}

	return savedContestants;
}

export async function updateContestantScores(
	gameId: string,
	contestantScoreMap: Record<string, number>,
	userId: string,
	logger: KADLogger,
): Promise<GameContestantDBRead[]> {
	if (!validateUuid(gameId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [gameId, 'Game']);
	}
	Object.keys(contestantScoreMap).forEach(contestantSessionId => {
		if (!validateUuid(contestantSessionId)) {
			throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [contestantSessionId, 'Contestant Session ID']);
		}
	});

	logger.info(`Looking up existing contestants for ${gameId}`);

	const existingContestants = await db
		.select()
		.from(gameContestants)
		.where(and(eq(gameContestants.gameId, gameId), isNull(gameContestants.deletedAt)));

	logger.info(`Existing sessions for game ${gameId}: ${existingContestants.map(c => c.sessionId).join(', ')}`);

	logger.info(`Updating contestant scores for game ${gameId}: ${JSON.stringify(contestantScoreMap, null, 4)}`);
	let updatedContestants: GameContestantDBRead[] = [];
	try {
		updatedContestants = await Promise.all(
			Object.keys(contestantScoreMap).map(async contestantSessionId => {
				const existingRec = existingContestants.find(e => e.sessionId === contestantSessionId);
				if (!existingRec) {
					throw new Error(`No existing record found for session ID ${contestantSessionId}`);
				}
				const updatedContestant = await db
					.update(gameContestants)
					.set({
						score: contestantScoreMap[contestantSessionId],
						updatedAt: sql`(datetime('now', 'localtime'))`,
						updatedBy: userId,
					})
					.where(eq(gameContestants.id, existingRec.id))
					.returning();
				logger.info(`Updated session ${contestantSessionId} in ${gameId}`);
				return updatedContestant[0];
			}),
		);
	} catch (err) {
		const { message, error } = streamlineError(err);
		logger.error(`Error updating contestant scores ${gameId}${message}`, { err: error });
		throw error;
	}

	logger.info(`Contestant scores for ${gameId} updated successfully: ${JSON.stringify(updatedContestants, null, 4)}`);

	return updatedContestants;
}
