import type { ClueInGame } from '@/types';

type WrongClueResponseGameState = {
	selectedClue: ClueInGame | null;
	buzzerQueue: string[];
	scores: Record<string, number>;
	activeContestantSessionId: string | undefined;
	buzzInTimeLeft: number | undefined;
};

export const wrongClueResponse = (state: WrongClueResponseGameState): WrongClueResponseGameState => {
	if (!state.selectedClue) {
		return state;
	}
	const winner = state.buzzerQueue[0];
	const clue = state.selectedClue;
	let buzzInTimeLeft: number | undefined;
	if (state.buzzerQueue.length <= 1) {
		buzzInTimeLeft = 5;
	}

	return {
		...state,
		buzzerQueue: state.buzzerQueue.slice(1),
		activeContestantSessionId: state.buzzerQueue[1],
		buzzInTimeLeft,
		scores: {
			...state.scores,
			[winner]: (state.scores[winner] || 0) - clue.value,
		},
	};
};
