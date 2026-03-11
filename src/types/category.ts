import type { Clue } from './clue';

export type Category = {
	id: string;
	title: string;
	clues: Clue[];
};
