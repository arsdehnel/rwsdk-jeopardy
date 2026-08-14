import { sql } from 'drizzle-orm';
import { KADRepositoryError, KADRepositoryErrorTypes } from '@/classes';
import db from '@/db';
import { gameContestants } from '@/models';
import type { Contestant, GameContestantDBRead, KADLogger } from '@/types';
import { validateUuid } from './utils';

export async function saveGameContestants(
	gameId: string,
	contestants: Contestant[],
	userId: string,
	logger: KADLogger,
): Promise<GameContestantDBRead[]> {
	if (!validateUuid(gameId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [gameId, 'Game']);
	}

	if (contestants.some(c => !validateUuid(c.sessionId))) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [gameId, 'Game Contestant']);
	}

	logger.info(`Saving contestants for game ${gameId}`);

	const savedContestants = await Promise.all(
		contestants.map(async c => {
			if (c.id) {
				const updatedContestant = await db
					.update(gameContestants)
					.set({
						sessionId: c.sessionId,
						name: c.name,
						userId: c.userId,
						updatedAt: sql`(datetime('now', 'localtime'))`,
						updatedBy: userId,
					})
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

	return savedContestants;
}
