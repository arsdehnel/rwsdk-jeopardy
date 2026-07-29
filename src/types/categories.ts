import type { categories } from '@/models';
import type { Clue, ClueDBRead } from './clue';

export type Category = {
	id: string;
	name: string;
	clues: Clue[];
};

export type GeneratedCategory = {
	name: string;
	clues: {
		text: string;
		response: string;
	}[];
};

export type CategoryDBRead = typeof categories.$inferSelect;
export type CategoryRepoInput = Omit<
	typeof categories.$inferInsert,
	'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'deletedAt' | 'deletedBy'
>;

export type CategoryWithClues = CategoryDBRead & {
	clues: ClueDBRead[];
};
