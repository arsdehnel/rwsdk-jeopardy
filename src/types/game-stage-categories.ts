import type { gameStageCategories } from '@/models';

export type GameStageCategoryDBRead = typeof gameStageCategories.$inferSelect;
export type GameStageCategoryRepoInput = Omit<
	typeof gameStageCategories.$inferInsert,
	'gameStageId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'deletedAt' | 'deletedBy'
>;
