import { KADRepositoryError, KADRepositoryErrorTypes } from '@/classes';
import db from '@/db';
import { clues } from '@/models';
import type { ClueDBRead, ClueRepoInput, KADLogger } from '@/types';

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
