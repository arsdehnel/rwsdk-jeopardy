import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { sql } from 'drizzle-orm/sql/sql';
import { KADRepositoryError, KADRepositoryErrorTypes } from '@/classes';
import db from '@/db';
import { clues, verifications } from '@/models';
import type { ClueDBRead, ClueRepoInput, ClueWithVerifications, KADLogger, VerificationDBRead } from '@/types';
import { validateUuid } from '@/utils';
import { streamlineError } from './utils';

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

export async function getCluesByCategoryId(categoryId: string, logger: KADLogger): Promise<ClueWithVerifications[]> {
	if (!validateUuid(categoryId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [categoryId, 'Category']);
	}

	logger.debug(`Fetching clues for category ${categoryId}`);
	let clues: ClueWithVerifications[] | undefined;
	try {
		clues = await db.query.clues.findMany({
			where: {
				categoryId: { eq: categoryId },
				deletedAt: { isNull: true },
			},
			with: {
				verifications: true,
			},
		});
	} catch (err) {
		const { message, error } = streamlineError(err);
		logger.error(`Error fetching clues for category ${categoryId}${message}`, { err: error });
		throw error;
	}

	logger.debug(`Fetched ${clues.length} clues for category ${categoryId}`);
	return clues;
}

export async function getClueById(clueId: string, logger: KADLogger): Promise<ClueWithVerifications> {
	if (!validateUuid(clueId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [clueId, 'Clue']);
	}

	logger.debug(`Fetching clue ${clueId}`);
	const clue = await db.query.clues.findFirst({
		where: {
			id: { eq: clueId },
			deletedAt: { isNull: true },
		},
		with: {
			verifications: true,
		},
	});

	if (!clue) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.UnexpectedRecordCount, [0, 1, 'Clue']);
	}

	logger.debug(`Fetched clue ${clueId}`);
	return clue;
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

export async function updateClue(
	clueId: string,
	clue: Partial<ClueRepoInput>,
	userId: string,
	logger: KADLogger,
): Promise<ClueDBRead> {
	if (!validateUuid(clueId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [clueId, 'Clue']);
	}

	logger.info(`Updating clue ${clueId}`);
	const updatedClues = await db
		.update(clues)
		.set({ ...clue, updatedBy: userId, updatedAt: sql`(datetime('now', 'localtime'))` })
		.where(eq(clues.id, clueId))
		.returning();

	if (updatedClues.length !== 1) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.UnexpectedRecordCount, [updatedClues.length, 1, 'Clue']);
	}

	logger.debug(`Updated clue ${clueId}`);
	return updatedClues[0];
}

export async function verifyClue(
	clueId: string,
	userId: string,
	logger: KADLogger,
): Promise<{ clue: ClueDBRead; verification: VerificationDBRead }> {
	if (!validateUuid(clueId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [clueId, 'Clue']);
	}
	logger.debug(`Verifying clue ${clueId}`);

	const [verificationRecord] = await db
		.insert(verifications)
		.values({
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
