import type { gameStages } from '@/models';

export type GameStageDBRead = typeof gameStages.$inferSelect;
export type GameStageRepoInput = Omit<
	typeof gameStages.$inferInsert,
	'gameId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'deletedAt' | 'deletedBy'
>;
