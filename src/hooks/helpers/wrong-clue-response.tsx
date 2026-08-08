import type { ClueInGame } from '@/types';

type WrongClueResponseGameState = {
	selectedClue: ClueInGame | null;
	buzzerQueue: string[];
	scores: Record<string, number>;
	activeContestant: string | undefined;
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
		activeContestant: state.buzzerQueue[1],
		scores: {
			...state.scores,
			[winner]: (state.scores[winner] || 0) - clue.value,
		},
	};
};
