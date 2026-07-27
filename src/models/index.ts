export * from './categories';
export * from './clues';
export * from './credentials';
export * from './users';

import { cluesRelations } from './clues';
import { credentialsRelations } from './credentials';

export const relations = { ...credentialsRelations, ...cluesRelations };
