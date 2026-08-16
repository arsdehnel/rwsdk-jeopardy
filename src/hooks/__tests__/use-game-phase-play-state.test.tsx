import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import useGamePhasePlayState from '@/hooks/use-game-phase-play-state';
import type { ClueInGame } from '@/types';

const GAME_ID = 'test-game';
const SESSION_A = 'session-a';
const SESSION_B = 'session-b';

const clue: ClueInGame = { id: crypto.randomUUID(), value: 200, text: 'This is a clue', response: 'What is an answer?' };
const clue2: ClueInGame = { id: crypto.randomUUID(), value: 400, text: 'Another clue', response: 'What is another answer?' };

describe('initial state', () => {
	it('has no selected clue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		expect(result.current.selectedClue).toBeNull();
	});

	it('has an empty buzzer queue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		expect(result.current.buzzerQueue).toHaveLength(0);
	});

	it('has no active contestant', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		expect(result.current.activeContestant).toBeUndefined();
	});

	it('has no buzz-in time left', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		expect(result.current.buzzInTimeLeft).toBeUndefined();
	});

	it('has empty scores', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		expect(result.current.scores).toEqual({});
	});

	it('has no used clue ids', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		expect(result.current.usedClueIds).toHaveLength(0);
	});
});

describe('selectClue', () => {
	it('sets the selected clue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		expect(result.current.selectedClue).toEqual(clue);
	});

	it('sets buzzInTimeLeft to 5', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		expect(result.current.buzzInTimeLeft).toBe(5);
	});
});

describe('abortClue', () => {
	it('clears the selected clue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.abortClue());
		expect(result.current.selectedClue).toBeNull();
	});

	it('clears the buzzer queue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.abortClue());
		expect(result.current.buzzerQueue).toHaveLength(0);
	});

	it('clears buzzInTimeLeft', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.abortClue());
		expect(result.current.buzzInTimeLeft).toBeUndefined();
	});
});

describe('buzzIn', () => {
	it('adds the current session to the buzzer queue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		expect(result.current.buzzerQueue).toContain(SESSION_A);
	});

	it('clears buzzInTimeLeft', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		expect(result.current.buzzInTimeLeft).toBeUndefined();
	});

	it('does not add the same session twice', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.buzzIn());
		expect(result.current.buzzerQueue).toHaveLength(1);
	});

	it('adds subsequent sessions to the back of the queue', () => {
		const { result, rerender } = renderHook(({ sessionId }) => useGamePhasePlayState(sessionId, GAME_ID, []), {
			initialProps: { sessionId: SESSION_A },
		});
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		rerender({ sessionId: SESSION_B });
		act(() => result.current.buzzIn());
		expect(result.current.buzzerQueue).toEqual([SESSION_A, SESSION_B]);
	});

	// This test fails because buzzIn ignores its argument and uses the closed-over
	// sessionId instead. The type declaration says (contestantSessionId: string)
	// but the implementation takes no parameter. The fix is to change the type to () => void.
	it('uses the hook session id, not the passed argument', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_B, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		expect(result.current.buzzerQueue).toContain(SESSION_B);
		expect(result.current.buzzerQueue).not.toContain(SESSION_A);
	});
});

describe('resetBuzzers', () => {
	it('clears the buzzer queue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.resetBuzzers());
		expect(result.current.buzzerQueue).toHaveLength(0);
	});

	it('resets buzzInTimeLeft to 5', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.resetBuzzers());
		expect(result.current.buzzInTimeLeft).toBe(5);
	});
});

describe('decreaseBuzzerTimeLeft', () => {
	it('decrements buzzInTimeLeft by 1', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.decreaseBuzzerTimeLeft());
		expect(result.current.buzzInTimeLeft).toBe(4);
	});

	it('is a no-op when buzzInTimeLeft is undefined', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.decreaseBuzzerTimeLeft());
		expect(result.current.buzzInTimeLeft).toBeUndefined();
	});

	it('is a no-op when buzzInTimeLeft is 0', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.decreaseBuzzerTimeLeft()); // 4
		act(() => result.current.decreaseBuzzerTimeLeft()); // 3
		act(() => result.current.decreaseBuzzerTimeLeft()); // 2
		act(() => result.current.decreaseBuzzerTimeLeft()); // 1
		act(() => result.current.decreaseBuzzerTimeLeft()); // 0
		act(() => result.current.decreaseBuzzerTimeLeft()); // still 0
		expect(result.current.buzzInTimeLeft).toBe(0);
	});
});

describe('correctClueResponse', () => {
	it('clears the selected clue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.correctClueResponse());
		expect(result.current.selectedClue).toBeNull();
	});

	it('clears the buzzer queue', () => {
		const { result, rerender } = renderHook(({ sessionId }) => useGamePhasePlayState(sessionId, GAME_ID, []), {
			initialProps: { sessionId: SESSION_A },
		});
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		rerender({ sessionId: SESSION_B });
		act(() => result.current.buzzIn());
		rerender({ sessionId: SESSION_A });
		act(() => result.current.correctClueResponse());
		expect(result.current.buzzerQueue).toHaveLength(0);
	});

	it('awards points to the first contestant in the queue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.correctClueResponse());
		expect(result.current.scores[SESSION_A]).toBe(clue.value);
	});

	it('sets the active contestant to the winner', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.correctClueResponse());
		expect(result.current.activeContestant).toBe(SESSION_A);
	});

	it('adds the clue id to usedClueIds', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.correctClueResponse());
		expect(result.current.usedClueIds).toContain(clue.id);
	});

	it('accumulates points across multiple clues', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.correctClueResponse());
		act(() => result.current.selectClue(clue2));
		act(() => result.current.buzzIn());
		act(() => result.current.correctClueResponse());
		expect(result.current.scores[SESSION_A]).toBe(clue.value + clue2.value);
	});

	it('clears buzzInTimeLeft', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.correctClueResponse());
		expect(result.current.buzzInTimeLeft).toBeUndefined();
	});

	it('is a no-op when there is no selected clue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.buzzIn());
		act(() => result.current.correctClueResponse());
		expect(result.current.buzzerQueue).toHaveLength(1);
		expect(result.current.scores[SESSION_A]).toBeUndefined();
	});
});

describe('wrongClueResponse', () => {
	it('deducts points from the first contestant in the queue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.wrongClueResponse());
		expect(result.current.scores[SESSION_A]).toBe(-clue.value);
	});

	it('removes the first contestant from the queue', () => {
		const { result, rerender } = renderHook(({ sessionId }) => useGamePhasePlayState(sessionId, GAME_ID, []), {
			initialProps: { sessionId: SESSION_A },
		});
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		rerender({ sessionId: SESSION_B });
		act(() => result.current.buzzIn());
		rerender({ sessionId: SESSION_A });
		act(() => result.current.wrongClueResponse());
		expect(result.current.buzzerQueue).toEqual([SESSION_B]);
	});

	it('advances the active contestant to the next in queue', () => {
		const { result, rerender } = renderHook(({ sessionId }) => useGamePhasePlayState(sessionId, GAME_ID, []), {
			initialProps: { sessionId: SESSION_A },
		});
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		rerender({ sessionId: SESSION_B });
		act(() => result.current.buzzIn());
		rerender({ sessionId: SESSION_A });
		act(() => result.current.wrongClueResponse());
		expect(result.current.activeContestant).toBe(SESSION_B);
	});

	it('clears active contestant when the last contestant in queue answers wrong', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.wrongClueResponse());
		expect(result.current.activeContestant).toBeUndefined();
	});

	it('resets buzzInTimeLeft to 5 when the queue empties', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.wrongClueResponse());
		expect(result.current.buzzInTimeLeft).toBe(5);
	});

	it('is a no-op when there is no selected clue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.buzzIn());
		act(() => result.current.wrongClueResponse());
		expect(result.current.buzzerQueue).toHaveLength(1);
		expect(result.current.scores[SESSION_A]).toBeUndefined();
	});
});

describe('expireClue', () => {
	it('clears the selected clue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.expireClue());
		expect(result.current.selectedClue).toBeNull();
	});

	it('clears the buzzer queue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.expireClue());
		expect(result.current.buzzerQueue).toHaveLength(0);
	});

	it('adds the clue id to usedClueIds', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.expireClue());
		expect(result.current.usedClueIds).toContain(clue.id);
	});

	it('clears buzzInTimeLeft', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.expireClue());
		expect(result.current.buzzInTimeLeft).toBeUndefined();
	});

	it('is a no-op when there is no selected clue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.buzzIn());
		act(() => result.current.expireClue());
		expect(result.current.buzzerQueue).toHaveLength(1);
	});
});

describe('usedClueIds', () => {
	it('does not add duplicate clue ids', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.correctClueResponse());
		act(() => result.current.selectClue(clue));
		act(() => result.current.expireClue());
		expect(result.current.usedClueIds.filter(id => id === clue.id)).toHaveLength(1);
	});
});
