import type { ClueInGame } from '@/types';

type ExpireClueGameState = {
	selectedClue: ClueInGame | null;
	buzzerQueue: string[];
	usedClueIds: string[];
};

export const expireClue = (state: ExpireClueGameState): ExpireClueGameState => {
	if (!state.selectedClue) {
		return state;
	}
	const clue = state.selectedClue;

	return {
		...state,
		selectedClue: null,
		buzzerQueue: [],
		usedClueIds: Array.from(new Set([...state.usedClueIds, clue.id])),
	};
};
