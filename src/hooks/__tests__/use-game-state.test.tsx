import { randomUUID } from 'node:crypto';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import useGameState from '@/hooks/use-game-state';
import type { Clue, Connection } from '@/types';

const host: Connection = { id: 'host-1', name: 'Alice', role: 'host' };
const display: Connection = { id: 'display-1', name: 'TV', role: 'display' };
const contestant1: Connection = { id: 'contestant-1', name: 'Bob', role: 'contestant' };
const contestant2: Connection = { id: 'contestant-2', name: 'Carol', role: 'contestant' };

const clue: Clue = { id: randomUUID(), value: 200, clue: 'This is a clue', response: 'What is an answer?' };

describe('registerConnection', () => {
	it('registers a host', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.registerConnection(host));
		expect(result.current.connections.host).toEqual(host);
	});

	it('registers a display', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.registerConnection(display));
		expect(result.current.connections.display).toEqual(display);
	});

	it('registers a contestant', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.registerConnection(contestant1));
		expect(result.current.connections.contestants).toContainEqual(contestant1);
	});

	it('throws on conflict', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.registerConnection(host));
		const newHost: Connection = { id: 'host-2', name: 'Dave', role: 'host' };
		expect(() => act(() => result.current.registerConnection(newHost))).toThrow();
	});
});

describe('unregisterConnection', () => {
	it('unregisters a host', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.registerConnection(host));
		act(() => result.current.unregisterConnection(host.id));
		expect(result.current.connections.host).toBeUndefined();
	});

	it('unregisters a contestant', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.registerConnection(contestant1));
		act(() => result.current.unregisterConnection(contestant1.id));
		expect(result.current.connections.contestants).not.toContainEqual(contestant1);
	});

	it('silently succeeds for an unknown id', () => {
		const { result } = renderHook(() => useGameState());
		expect(() => act(() => result.current.unregisterConnection('nonexistent-id'))).not.toThrow();
	});
});

describe('role derivation', () => {
	it('returns host role when session matches host connection', () => {
		const { result } = renderHook(() => useGameState('host-1'));
		act(() => result.current.registerConnection(host));
		expect(result.current.role).toBe('host');
	});

	it('returns display role when session matches display connection', () => {
		const { result } = renderHook(() => useGameState('display-1'));
		act(() => result.current.registerConnection(display));
		expect(result.current.role).toBe('display');
	});

	it('returns contestant role when session matches a contestant connection', () => {
		const { result } = renderHook(() => useGameState('contestant-1'));
		act(() => result.current.registerConnection(contestant1));
		expect(result.current.role).toBe('contestant');
	});

	it('returns undefined when session does not match any connection', () => {
		const { result } = renderHook(() => useGameState('unknown-id'));
		expect(result.current.role).toBeUndefined();
	});
});

describe('buzzerQueue', () => {
	it('adds first contestant to the queue', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.buzzIn(contestant1.id));
		expect(result.current.buzzerQueue[0]).toBe(contestant1.id);
	});

	it('adds subsequent contestants to the back of the queue', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.buzzIn(contestant1.id));
		act(() => result.current.buzzIn(contestant2.id));
		expect(result.current.buzzerQueue).toEqual([contestant1.id, contestant2.id]);
	});

	it('does not add the same contestant twice', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.buzzIn(contestant1.id));
		act(() => result.current.buzzIn(contestant1.id));
		expect(result.current.buzzerQueue).toHaveLength(1);
	});

	it('advances the queue on a wrong answer', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn(contestant1.id));
		act(() => result.current.buzzIn(contestant2.id));
		act(() => result.current.wrongClueResponse());
		expect(result.current.buzzerQueue[0]).toBe(contestant2.id);
	});

	it('empties the queue when the last contestant answers incorrectly', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn(contestant1.id));
		act(() => result.current.wrongClueResponse());
		expect(result.current.buzzerQueue).toHaveLength(0);
	});

	it('clears the queue on resetBuzzers', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.buzzIn(contestant1.id));
		act(() => result.current.buzzIn(contestant2.id));
		act(() => result.current.resetBuzzers());
		expect(result.current.buzzerQueue).toHaveLength(0);
	});

	it('clears the queue on correctClueResponse', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn(contestant1.id));
		act(() => result.current.buzzIn(contestant2.id));
		act(() => result.current.correctClueResponse());
		expect(result.current.buzzerQueue).toHaveLength(0);
	});
});

describe('selectClue', () => {
	it('sets the selected clue', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.selectClue(clue));
		expect(result.current.selectedClue).toEqual(clue);
	});
});

describe('abortClue', () => {
	it('clears the selected clue', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.selectClue(clue));
		act(() => result.current.abortClue());
		expect(result.current.selectedClue).toBeNull();
	});

	it('clears the buzzer queue', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.buzzIn(contestant1.id));
		act(() => result.current.abortClue());
		expect(result.current.buzzerQueue).toHaveLength(0);
	});
});

describe('correctClueResponse', () => {
	it('clears the selected clue', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.selectClue(clue));
		act(() => result.current.correctClueResponse());
		expect(result.current.selectedClue).toBeNull();
	});

	it('clears the buzzer queue', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn(contestant1.id));
		act(() => result.current.correctClueResponse());
		expect(result.current.buzzerQueue).toHaveLength(0);
	});

	it('is a no-op when there is no selected clue', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.buzzIn(contestant1.id));
		act(() => result.current.correctClueResponse());
		expect(result.current.buzzerQueue).toHaveLength(1);
	});
});

describe('usedClueIds', () => {
	it('starts empty', () => {
		const { result } = renderHook(() => useGameState());
		expect(result.current.usedClueIds).toHaveLength(0);
	});

	it('adds clue id on correctClueResponse', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.selectClue(clue));
		act(() => result.current.correctClueResponse());
		expect(result.current.usedClueIds).toContain(clue.id);
	});

	it('adds clue id on expireClue', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.selectClue(clue));
		act(() => result.current.expireClue());
		expect(result.current.usedClueIds).toContain(clue.id);
	});

	it('expireClue also clears selected clue', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.selectClue(clue));
		act(() => result.current.expireClue());
		expect(result.current.selectedClue).toBeNull();
	});

	it('expireClue also resets buzzers', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn(contestant1.id));
		act(() => result.current.expireClue());
		expect(result.current.buzzerQueue).toHaveLength(0);
	});

	it('expireClue is a no-op when there is no selected clue', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.buzzIn(contestant1.id));
		act(() => result.current.expireClue());
		expect(result.current.buzzerQueue).toHaveLength(1);
	});

	it('does not add duplicate clue ids', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.selectClue(clue));
		act(() => result.current.correctClueResponse());
		act(() => result.current.selectClue(clue));
		act(() => result.current.expireClue());
		expect(result.current.usedClueIds.filter(id => id === clue.id)).toHaveLength(1);
	});

	it('does not clear on setupGame', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.selectClue(clue));
		act(() => result.current.correctClueResponse());
		act(() => result.current.setupGame());
		expect(result.current.usedClueIds).toContain(clue.id);
	});

	it('does not clear on finishGame', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.selectClue(clue));
		act(() => result.current.correctClueResponse());
		act(() => result.current.finishGame());
		expect(result.current.usedClueIds).toContain(clue.id);
	});
});

describe('scores', () => {
	it('starts empty', () => {
		const { result } = renderHook(() => useGameState());
		expect(result.current.scores).toEqual({});
	});

	it('awards points to the buzzed in contestant on correctClueResponse', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn(contestant1.id));
		act(() => result.current.correctClueResponse());
		expect(result.current.scores[contestant1.id]).toBe(clue.value);
	});

	it('deducts points from the buzzed in contestant on wrongClueResponse', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn(contestant1.id));
		act(() => result.current.wrongClueResponse());
		expect(result.current.scores[contestant1.id]).toBe(-clue.value);
	});

	it('is a no-op when there is no selected clue', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.buzzIn(contestant1.id));
		act(() => result.current.wrongClueResponse());
		expect(result.current.scores[contestant1.id]).toBeUndefined();
	});

	it('accumulates points across multiple clues', () => {
		const clue2: Clue = { id: randomUUID(), value: 400, clue: 'Another clue', response: 'What is another answer?' };
		const { result } = renderHook(() => useGameState());
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn(contestant1.id));
		act(() => result.current.correctClueResponse());
		act(() => result.current.selectClue(clue2));
		act(() => result.current.buzzIn(contestant1.id));
		act(() => result.current.correctClueResponse());
		expect(result.current.scores[contestant1.id]).toBe(clue.value + clue2.value);
	});

	it('tracks scores independently per contestant', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn(contestant1.id));
		act(() => result.current.wrongClueResponse());
		act(() => result.current.buzzIn(contestant2.id));
		act(() => result.current.correctClueResponse());
		expect(result.current.scores[contestant1.id]).toBe(-clue.value);
		expect(result.current.scores[contestant2.id]).toBe(clue.value);
	});

	it('is undefined for a contestant who has not answered', () => {
		const { result } = renderHook(() => useGameState());
		expect(result.current.scores[contestant1.id]).toBeUndefined();
	});

	it('does not reset on setupGame', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn(contestant1.id));
		act(() => result.current.correctClueResponse());
		act(() => result.current.setupGame());
		expect(result.current.scores[contestant1.id]).toBe(clue.value);
	});

	it('does not reset on finishGame', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn(contestant1.id));
		act(() => result.current.correctClueResponse());
		act(() => result.current.finishGame());
		expect(result.current.scores[contestant1.id]).toBe(clue.value);
	});

	it('is a no-op when there is no selected clue', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.buzzIn(contestant1.id));
		act(() => result.current.correctClueResponse());
		expect(result.current.scores[contestant1.id]).toBeUndefined();
	});
});

describe('game phase transitions', () => {
	it('starts in setup phase', () => {
		const { result } = renderHook(() => useGameState());
		expect(result.current.gamePhase).toBe('setup');
	});

	it('transitions to active on startGame', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.startGame());
		expect(result.current.gamePhase).toBe('active');
	});

	it('transitions to finished on finishGame and clears state', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn(contestant1.id));
		act(() => result.current.finishGame());
		expect(result.current.gamePhase).toBe('finished');
		expect(result.current.selectedClue).toBeNull();
		expect(result.current.buzzerQueue).toHaveLength(0);
	});

	it('transitions back to setup on setupGame and clears state', () => {
		const { result } = renderHook(() => useGameState());
		act(() => result.current.startGame());
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn(contestant1.id));
		act(() => result.current.setupGame());
		expect(result.current.gamePhase).toBe('setup');
		expect(result.current.selectedClue).toBeNull();
		expect(result.current.buzzerQueue).toHaveLength(0);
	});
});
