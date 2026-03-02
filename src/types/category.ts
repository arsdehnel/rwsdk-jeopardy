import type { Clue } from './clue';

export type TCategory = {
	id: number;
	title: string;
	clues: Clue[];
};
