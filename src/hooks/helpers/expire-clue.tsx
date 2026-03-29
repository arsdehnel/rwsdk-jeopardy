import type { Clue } from '@/types';

type ExpireClueGameState = {
	selectedClue: Clue | null;
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
