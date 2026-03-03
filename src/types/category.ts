import type { Clue } from './clue';

export type Category = {
	id: number;
	title: string;
	clues: Clue[];
};
