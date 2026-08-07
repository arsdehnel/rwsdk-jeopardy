import type { categories } from '@/models';
import type { ClueDBRead, ClueInGame } from './clues';
import type { VerificationDBRead } from './verifications';

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

export type CategoryWithVerifications = CategoryDBRead & {
	verifications: VerificationDBRead[];
};

export type CategoryInGame = Pick<CategoryDBRead, 'id' | 'name'> & {
	clues: ClueInGame[];
};
