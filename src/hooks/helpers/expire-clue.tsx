import type { GamePhasePlayState } from '../use-game-phase-play-state';

type ExpireClueGameState = Pick<
	GamePhasePlayState,
	'selectedClue' | 'buzzerQueue' | 'buzzInTimeLeft' | 'responseTimeLeft' | 'usedClueIds'
>;

export const expireClue = (state: ExpireClueGameState): ExpireClueGameState => {
	if (!state.selectedClue) {
		return state;
	}
	const clue = state.selectedClue;

	return {
		...state,
		selectedClue: null,
		buzzerQueue: [],
		buzzInTimeLeft: undefined,
		responseTimeLeft: undefined,
		usedClueIds: Array.from(new Set([...state.usedClueIds, clue.id])),
	};
};
