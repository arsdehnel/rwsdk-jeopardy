import type { Clue } from './clue';

export type Category = {
	id: string;
	title: string;
	clues: Clue[];
};

export type GeneratedCategory = {
	title: string;
	clues: {
		clue: string;
		response: string;
	}[];
};
