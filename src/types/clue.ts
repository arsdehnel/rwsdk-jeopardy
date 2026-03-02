export type Clue = {
	id: number;
	value: number | undefined; // undefined originally and we inject the value based on position and the "round" of Jeopardy
	clue: string;
	response: string;
};
