import type { GamePhasePlayState } from '../use-game-phase-play-state';

type WrongClueResponseGameState = Pick<
	GamePhasePlayState,
	'selectedClue' | 'buzzerQueue' | 'buzzInTimeLeft' | 'responseTimeLeft' | 'scores'
> & {
	activeContestantSessionId: string | undefined;
};

export const wrongClueResponse = (state: WrongClueResponseGameState): WrongClueResponseGameState => {
	if (!state.selectedClue) {
		return state;
	}
	const winner = state.buzzerQueue[0];
	if (!winner) return state;
	const clue = state.selectedClue;
	let buzzInTimeLeft: number | undefined;
	if (state.buzzerQueue.length <= 1) {
		buzzInTimeLeft = 5;
	}
	let responseTimeLeft: number | undefined;
	if (state.buzzerQueue.length > 1) {
		responseTimeLeft = 5;
	}

	return {
		...state,
		buzzerQueue: state.buzzerQueue.slice(1),
		activeContestantSessionId: state.buzzerQueue[1],
		buzzInTimeLeft,
		responseTimeLeft,
		scores: {
			...state.scores,
			[winner]: (state.scores[winner] || 0) - clue.value,
		},
	};
};
