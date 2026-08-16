import { describe, expect, it } from 'vitest';
import { correctClueResponse } from '@/hooks/helpers';
import type { Connection, Connections, GamePhaseEnum } from '@/types';

const host: Connection = { id: 'host-1', name: 'Alice', role: 'host' };
const display: Connection = { id: 'display-1', name: 'TV', role: 'display' };
const player1: Connection = { id: 'player-1', name: 'Bob', role: 'contestant' };
const player2: Connection = { id: 'player-2', name: 'Carol', role: 'contestant' };

const mockConnections: Connections = {
	host,
	display,
	contestants: [player1, player2],
};

const baseState = {
	connections: mockConnections,
	selectedClue: { id: 'clue-1', value: 200, text: 'What is...', response: '...' },
	gamePhase: 'PLAYING' as GamePhaseEnum,
	buzzerQueue: ['player-1', 'player-2'],
	usedClueIds: [],
	scores: {},
	activeContestantSessionId: undefined,
	buzzInTimeLeft: undefined,
};

describe('correctClueResponse', () => {
	it('responds with the same state if no clue is selected', () => {
		const currentGameState = { ...baseState, selectedClue: null, buzzerQueue: [] };
		const result = correctClueResponse(currentGameState);
		expect(result).toEqual(currentGameState);
	});

	it('responds with updated state when a clue is selected', () => {
		const result = correctClueResponse(baseState);
		expect(result).toEqual({
			...baseState,
			selectedClue: null,
			activeContestantSessionId: 'player-1',
			buzzerQueue: [],
			usedClueIds: ['clue-1'],
			scores: { 'player-1': 200 },
		});
	});

	it('does not duplicate used clue IDs', () => {
		const result = correctClueResponse({ ...baseState, usedClueIds: ['clue-1'] });
		expect(result.usedClueIds).toEqual(['clue-1']);
	});

	it('handles scoring for players without existing scores', () => {
		const result = correctClueResponse({ ...baseState, buzzerQueue: ['player-2'] });
		expect(result.scores['player-2']).toBe(200);
	});

	it('accumulates score for a player with an existing score', () => {
		const result = correctClueResponse({ ...baseState, scores: { 'player-1': 400 } });
		expect(result.scores['player-1']).toBe(600);
	});

	it('does not affect scores of other players', () => {
		const result = correctClueResponse({ ...baseState, scores: { 'player-2': 400 } });
		expect(result.scores['player-2']).toBe(400);
	});

	it('awards points to the first player in the buzzer queue', () => {
		const result = correctClueResponse({ ...baseState, buzzerQueue: ['player-2', 'player-1'] });
		expect(result.scores['player-2']).toBe(200);
		expect(result.scores['player-1']).toBeUndefined();
	});

	it('clears the buzzer queue', () => {
		const result = correctClueResponse(baseState);
		expect(result.buzzerQueue).toHaveLength(0);
	});

	it('clears the selected clue', () => {
		const result = correctClueResponse(baseState);
		expect(result.selectedClue).toBeNull();
	});

	it('adds the clue id to usedClueIds', () => {
		const result = correctClueResponse(baseState);
		expect(result.usedClueIds).toContain('clue-1');
	});

	it('preserves existing usedClueIds', () => {
		const result = correctClueResponse({ ...baseState, usedClueIds: ['clue-0'] });
		expect(result.usedClueIds).toContain('clue-0');
		expect(result.usedClueIds).toContain('clue-1');
	});

	it('does not mutate the input state', () => {
		const frozen = Object.freeze({ ...baseState, scores: Object.freeze({ 'player-1': 0 }) });
		expect(() => correctClueResponse(frozen as typeof baseState)).not.toThrow();
	});

	it('does not modify gamePhase', () => {
		const result = correctClueResponse(baseState);
		expect(result.gamePhase).toBe('PLAYING');
	});

	it('does not modify connections', () => {
		const result = correctClueResponse(baseState);
		expect(result.connections).toEqual(mockConnections);
	});
});
