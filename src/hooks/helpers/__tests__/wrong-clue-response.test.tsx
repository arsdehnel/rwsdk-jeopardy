import { describe, expect, it } from 'vitest';
import { wrongClueResponse } from '@/hooks/helpers';
import type { Connection, Connections, GamePhase } from '@/types';

const host: Connection = { id: 'host-1', name: 'Alice', role: 'host' };
const display: Connection = { id: 'display-1', name: 'TV', role: 'display' };
const player1: Connection = { id: 'player-1', name: 'Bob', role: 'contestant' };
const player2: Connection = { id: 'player-2', name: 'Carol', role: 'contestant' };

const mockConnections: Connections = { host, display, contestants: [player1, player2] };

const baseState = {
	connections: mockConnections,
	selectedClue: { id: 'clue-1', value: 200, clue: 'What is...', response: '...' },
	gamePhase: 'active' as GamePhase,
	buzzerQueue: ['player-1', 'player-2'],
	usedClueIds: [],
	scores: {},
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
});
