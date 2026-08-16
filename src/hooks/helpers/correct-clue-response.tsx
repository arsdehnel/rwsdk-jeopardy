import type { ClueInGame, Connections, GamePhaseEnum } from '@/types';

type CorrectClueResponseGameState = {
	connections?: Connections;
	selectedClue: ClueInGame | null;
	gamePhase?: GamePhaseEnum;
	buzzerQueue: string[];
	usedClueIds: string[];
	scores: Record<string, number>;
	activeContestantSessionId: string | undefined;
	buzzInTimeLeft: number | undefined;
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
		activeContestantSessionId: winner,
		buzzInTimeLeft: undefined,
		scores: {
			...state.scores,
			[winner]: (state.scores[winner] || 0) + clue.value,
		},
	};
};
