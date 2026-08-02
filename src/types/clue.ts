import type { clues } from '@/models';

export type ClueInGame = Pick<ClueDBRead, 'id' | 'text' | 'response'> & { value: number };

export type ClueDBRead = typeof clues.$inferSelect;
export type ClueRepoInput = Omit<
	typeof clues.$inferInsert,
	'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'deletedAt' | 'deletedBy'
>;
