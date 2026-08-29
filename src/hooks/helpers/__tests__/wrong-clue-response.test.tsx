import { describe, expect, it } from 'vitest';
import { wrongClueResponse } from '@/hooks/helpers';
import type { GamePhaseEnum } from '@/types';

const baseState = {
	selectedClue: { id: 'clue-1', value: 200, text: 'What is...', response: '...' },
	gamePhase: 'PLAYING' as GamePhaseEnum,
	buzzerQueue: ['player-1', 'player-2'],
	usedClueIds: [],
	scores: {},
	activeContestantSessionId: undefined,
	buzzInTimeLeft: undefined,
	responseTimeLeft: undefined,
};

describe('wrongClueResponse', () => {
	it('returns same state if no clue is selected', () => {
		const state = { ...baseState, selectedClue: null };
		expect(wrongClueResponse(state)).toEqual(state);
	});

	it('deducts points from the first player in the queue', () => {
		expect(wrongClueResponse(baseState).scores['player-1']).toBe(-200);
	});

	it('deducts from existing score', () => {
		const result = wrongClueResponse({ ...baseState, scores: { 'player-1': 400 } });
		expect(result.scores['player-1']).toBe(200);
	});

	it('handles deduction for player with no existing score', () => {
		expect(wrongClueResponse({ ...baseState, scores: {} }).scores['player-1']).toBe(-200);
	});

	it('removes the first player from the buzzer queue', () => {
		expect(wrongClueResponse(baseState).buzzerQueue).toEqual(['player-2']);
	});

	it('results in an empty queue when only one player was in it', () => {
		const result = wrongClueResponse({ ...baseState, buzzerQueue: ['player-1'] });
		expect(result.buzzerQueue).toHaveLength(0);
	});

	it('does not affect scores of other players', () => {
		const result = wrongClueResponse({ ...baseState, scores: { 'player-2': 400 } });
		expect(result.scores['player-2']).toBe(400);
	});

	it('does not modify selectedClue', () => {
		expect(wrongClueResponse(baseState).selectedClue).toEqual(baseState.selectedClue);
	});

	it('does not mutate input state', () => {
		const frozen = Object.freeze({ ...baseState, scores: Object.freeze({}), buzzerQueue: Object.freeze(['player-1']) });
		expect(() => wrongClueResponse(frozen as typeof baseState)).not.toThrow();
	});

	it('sets responseTimeLeft to 5 when the next player takes over', () => {
		const result = wrongClueResponse(baseState); // queue has 2
		expect(result.responseTimeLeft).toBe(5);
	});

	it('clears responseTimeLeft when the queue empties', () => {
		const result = wrongClueResponse({ ...baseState, buzzerQueue: ['player-1'] });
		expect(result.responseTimeLeft).toBeUndefined();
	});

	it('clears buzzInTimeLeft when the next player takes over', () => {
		const result = wrongClueResponse(baseState); // queue has 2
		expect(result.buzzInTimeLeft).toBeUndefined();
	});

	it('sets buzzInTimeLeft to 5 when the queue empties', () => {
		const result = wrongClueResponse({ ...baseState, buzzerQueue: ['player-1'] });
		expect(result.buzzInTimeLeft).toBe(5);
	});

	it('is a no-op when the buzzer queue is empty', () => {
		const state = { ...baseState, buzzerQueue: [] };
		expect(wrongClueResponse(state)).toEqual(state);
	});
});
