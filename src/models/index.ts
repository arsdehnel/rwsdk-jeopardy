export * from './categories';
export * from './clues';
export * from './credentials';
export * from './game-stage-categories';
export * from './game-stages';
export * from './games';
export * from './users';

import { cluesRelations } from './clues';
import { credentialsRelations } from './credentials';
import { gameStagesRelations } from './game-stages';

export const relations = { ...credentialsRelations, ...cluesRelations, ...gameStagesRelations };
