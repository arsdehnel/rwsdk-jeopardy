import type { GamePhasePlayState } from '../use-game-phase-play-state';

type CorrectClueResponseGameState = Pick<
	GamePhasePlayState,
	'selectedClue' | 'buzzerQueue' | 'usedClueIds' | 'scores' | 'buzzInTimeLeft' | 'responseTimeLeft'
> & {
	activeContestantSessionId: string | undefined;
	answeredWrong: string[];
};

export const correctClueResponse = (state: CorrectClueResponseGameState): CorrectClueResponseGameState => {
	if (!state.selectedClue) return state;
	const clue = state.selectedClue;
	const winner = state.buzzerQueue[0];
	if (!winner) return state;
	return {
		...state,
		selectedClue: null,
		buzzerQueue: [],
		answeredWrong: [],
		usedClueIds: Array.from(new Set([...state.usedClueIds, clue.id])),
		activeContestantSessionId: winner,
		buzzInTimeLeft: undefined,
		responseTimeLeft: undefined,
		scores: {
			...state.scores,
			[winner]: (state.scores[winner] || 0) + clue.value,
		},
	};
};
