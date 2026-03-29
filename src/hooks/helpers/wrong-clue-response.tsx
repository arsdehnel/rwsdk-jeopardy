import type { Clue } from '@/types';

type WrongClueResponseGameState = {
	selectedClue: Clue | null;
	buzzerQueue: string[];
	scores: Record<string, number>;
};

export const wrongClueResponse = (state: WrongClueResponseGameState): WrongClueResponseGameState => {
	if (!state.selectedClue) {
		return state;
	}
	const winner = state.buzzerQueue[0];
	const clue = state.selectedClue;

	return {
		...state,
		buzzerQueue: state.buzzerQueue.slice(1),
		scores: {
			...state.scores,
			[winner]: (state.scores[winner] || 0) - clue.value,
		},
	};
};
