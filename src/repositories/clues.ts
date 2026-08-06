import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { sql } from 'drizzle-orm/sql/sql';
import { KADRepositoryError, KADRepositoryErrorTypes } from '@/classes';
import db from '@/db';
import { clues, verifications } from '@/models';
import type { ClueDBRead, ClueRepoInput, KADLogger, VerificationDBRead } from '@/types';
import { validateUuid } from './utils';

export async function createClue(clue: ClueRepoInput, userId: string, logger: KADLogger): Promise<ClueDBRead> {
	logger.info(`Creating clue ${clue.text}`);

	const createdClues = await db
		.insert(clues)
		.values({
			...clue,
			createdBy: userId,
		})
		.returning();

	if (createdClues.length !== 1) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.UnexpectedRecordCount, [createdClues.length, 1, 'Clue']);
	}

	return createdClues[0];
}

export async function deleteClue(clueId: string, userId: string, logger: KADLogger): Promise<ClueDBRead> {
	if (!validateUuid(clueId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [clueId, 'Clue']);
	}

	logger.debug(`Deleting clue ${clueId}`);
	const deleted = await db
		.update(clues)
		.set({ deletedAt: sql`(datetime('now', 'localtime'))`, deletedBy: userId })
		.where(eq(clues.id, clueId))
		.returning();

	if (deleted.length !== 1) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.UnexpectedRecordCount, [deleted.length, 1, 'Clue']);
	}

	logger.info(`Deleted clue ${clueId}`);
	return deleted[0];
}

export async function verifyClue(
	clueId: string,
	categoryId: string,
	userId: string,
	logger: KADLogger,
): Promise<{ clue: ClueDBRead; verification: VerificationDBRead }> {
	if (!validateUuid(clueId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [clueId, 'Clue']);
	}
	if (!validateUuid(categoryId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [categoryId, 'Category']);
	}
	logger.debug(`Verifying clue ${clueId}`);

	const [verificationRecord] = await db
		.insert(verifications)
		.values({
			categoryId,
			clueId,
			createdBy: userId,
		})
		.returning();

	const [updatedClue] = await db
		.update(clues)
		.set({
			lastVerifiedAt: verificationRecord.createdAt,
			updatedAt: verificationRecord.createdAt,
			updatedBy: userId,
		})
		.where(eq(clues.id, clueId))
		.returning();

	logger.info(`Marked clue ${clueId} as verified`);

	return {
		clue: updatedClue,
		verification: verificationRecord,
	};
}
