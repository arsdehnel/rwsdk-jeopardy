import type { Clue, Connections, GamePhase } from '@/types';

type CorrectClueResponseGameState = {
	connections: Connections;
	selectedClue: Clue | null;
	gamePhase: GamePhase;
	buzzerQueue: string[];
	usedClueIds: string[];
	scores: Record<string, number>;
};

export const correctClueResponse = (state: CorrectClueResponseGameState): CorrectClueResponseGameState => {
	if (!state.selectedClue) return state;
	const clue = state.selectedClue;
	const winner = state.buzzerQueue[0];
	return {
		...state,
		selectedClue: null,
		buzzerQueue: [],
		usedClueIds: Array.from(new Set([...state.usedClueIds, clue.id])),
		scores: {
			...state.scores,
			[winner]: (state.scores[winner] || 0) + clue.value,
		},
	};
};
