import type { z } from 'zod';
import type { games } from '@/models';
import type { gamesSchemas } from '@/schemas';
import type { GameStageCategoryDBRead } from './game-stage-categories';
import type { GameStageDBRead } from './game-stages';

export type GameDBRead = typeof games.$inferSelect;
export type GameRepoInput = Omit<
	typeof games.$inferInsert,
	'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'deletedAt' | 'deletedBy'
>;

export type GamePhaseEnum = 'SETUP' | 'REGISTRATION' | 'PLAYING' | 'FINISHED';

// export type GameFormInput = {
// 	id?: string;
// 	phase?: GamePhaseEnum;
// 	stage?: 'SINGLE' | `DOUBLE` | 'TRIPLE' | 'FINAL';
// 	categories: string[];
// };

export type GameFormInput = z.input<typeof gamesSchemas.form>;

export type GameWithEverything = GameDBRead & {
	stages: (GameStageDBRead & {
		categories: GameStageCategoryDBRead[];
	})[];
};
