import type { clues } from '@/models';

export type Clue = {
	id: string;
	value: number;
	clue: string;
	response: string;
};

export type ClueDBRead = typeof clues.$inferSelect;
export type ClueRepoInput = Omit<
	typeof clues.$inferInsert,
	'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'deletedAt' | 'deletedBy'
>;
