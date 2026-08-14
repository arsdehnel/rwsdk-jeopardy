import type { gameContestants } from '@/models';

export type GameContestantDBRead = typeof gameContestants.$inferSelect;
export type GameContestantRepoInput = Omit<
	typeof gameContestants.$inferInsert,
	'gameId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'deletedAt' | 'deletedBy'
>;
