import type { categories } from '@/models';
import type { Clue } from './clue';

export type Category = {
	id: string;
	title: string;
	clues: Clue[];
};

export type GeneratedCategory = {
	title: string;
	clues: {
		clue: string;
		response: string;
	}[];
};

export type CategoryDBRead = typeof categories.$inferSelect;
export type CategoryRepoInput = Omit<
	typeof categories.$inferInsert,
	'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'deletedAt' | 'deletedBy'
>;
