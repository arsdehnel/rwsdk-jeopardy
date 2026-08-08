import type { ClueInGame } from '@/types';

type ExpireClueGameState = {
	selectedClue: ClueInGame | null;
	buzzerQueue: string[];
	usedClueIds: string[];
	buzzInTimeLeft: number | undefined;
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
		buzzInTimeLeft: undefined,
		usedClueIds: Array.from(new Set([...state.usedClueIds, clue.id])),
	};
};
