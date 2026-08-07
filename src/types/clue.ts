import type { clues } from '@/models';
import type { VerificationDBRead } from './verifications';

export type ClueInGame = Pick<ClueDBRead, 'id' | 'text' | 'response'> & { value: number };

export type ClueDBRead = typeof clues.$inferSelect;
export type ClueRepoInput = Omit<
	typeof clues.$inferInsert,
	'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'deletedAt' | 'deletedBy'
>;

export type ClueWithVerifications = ClueDBRead & {
	verifications: VerificationDBRead[];
};
