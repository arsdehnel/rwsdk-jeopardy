import type { z } from 'zod';
import type { clues } from '@/models';
import type { cluesSchemas } from '@/schemas';
import type { VerificationDBRead } from './verifications';

export type ClueInGame = Pick<ClueDBRead, 'id' | 'text' | 'response'> & { value: number };

export type ClueDBRead = typeof clues.$inferSelect;
export type ClueRepoInput = Omit<
	typeof clues.$inferInsert,
	'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'deletedAt' | 'deletedBy'
>;

export type ClueFormInput = z.input<typeof cluesSchemas.form>;

export type ClueWithVerifications = ClueDBRead & {
	verifications: VerificationDBRead[];
};
