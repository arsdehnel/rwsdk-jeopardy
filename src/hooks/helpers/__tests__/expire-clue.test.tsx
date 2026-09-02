// tests
import { describe, expect, it } from 'vitest';
import { expireClue } from '@/hooks/helpers';
import type { GamePhaseEnum } from '@/types';

const baseState = {
	selectedClue: { id: 'clue-1', value: 200, text: 'What is...', response: '...' },
	gamePhase: 'PLAYING' as GamePhaseEnum,
	buzzerQueue: ['player-1', 'player-2'],
	usedClueIds: [],
	scores: {},
	activeContestant: undefined,
	buzzInTimeLeft: undefined,
	responseTimeLeft: undefined,
	answeredWrong: [],
};

describe('expireClue', () => {
	it('returns same state if no clue is selected', () => {
		const state = { ...baseState, selectedClue: null, buzzerQueue: [] };
		expect(expireClue(state)).toEqual(state);
	});

	it('clears the selected clue', () => {
		expect(expireClue(baseState).selectedClue).toBeNull();
	});

	it('clears the buzzer queue', () => {
		expect(expireClue(baseState).buzzerQueue).toHaveLength(0);
	});

	it('adds the clue id to usedClueIds', () => {
		expect(expireClue(baseState).usedClueIds).toContain('clue-1');
	});

	it('preserves existing usedClueIds', () => {
		const result = expireClue({ ...baseState, usedClueIds: ['clue-0'] });
		expect(result.usedClueIds).toContain('clue-0');
		expect(result.usedClueIds).toContain('clue-1');
	});

	it('does not duplicate usedClueIds', () => {
		const result = expireClue({ ...baseState, usedClueIds: ['clue-1'] });
		expect(result.usedClueIds.filter(id => id === 'clue-1')).toHaveLength(1);
	});

	it('does not mutate input state', () => {
		const frozen = Object.freeze({ ...baseState, usedClueIds: Object.freeze([]) });
		expect(() => expireClue(frozen as typeof baseState)).not.toThrow();
	});

	it('clears responseTimeLeft', () => {
		const result = expireClue({ ...baseState, responseTimeLeft: 3 });
		expect(result.responseTimeLeft).toBeUndefined();
	});
});
