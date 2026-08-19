import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useGamePhasePlayState from '@/hooks/use-game-phase-play-state';
import type { ClueInGame, GameContestantDBRead } from '@/types';

const GAME_ID = 'test-game';
const SESSION_A = 'session-a';
const SESSION_B = 'session-b';
const CONTESTANTS: GameContestantDBRead[] = [
	{
		id: SESSION_A,
		sessionId: SESSION_A,
	},
	{
		id: SESSION_B,
		sessionId: SESSION_B,
	},
].map(c => ({
	...c,
	name: null,
	userId: null,
	updatedAt: null,
	updatedBy: null,
	deletedAt: null,
	deletedBy: null,
	score: null,
	gameId: GAME_ID,
	createdAt: new Date().toISOString(),
	createdBy: 'user-id',
}));

const clue: ClueInGame = { id: crypto.randomUUID(), value: 200, text: 'This is a clue', response: 'What is an answer?' };
const clue2: ClueInGame = { id: crypto.randomUUID(), value: 400, text: 'Another clue', response: 'What is another answer?' };

describe('initial state', () => {
	it('has no selected clue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		expect(result.current.selectedClue).toBeNull();
	});

	it('has an empty buzzer queue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		expect(result.current.buzzerQueue).toHaveLength(0);
	});

	it('has no active contestant', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, []));
		expect(result.current.activeContestant).toBeUndefined();
	});

	it('has no buzz-in time left', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		expect(result.current.buzzInTimeLeft).toBeUndefined();
	});

	it('has no response time left', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		expect(result.current.responseTimeLeft).toBeUndefined();
	});

	it('has empty scores', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		expect(result.current.scores).toEqual({});
	});

	it('has no used clue ids', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		expect(result.current.usedClueIds).toHaveLength(0);
	});

	it('buzz-in timer is not active', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		expect(result.current.buzzInTimerIsActive).toBe(false);
	});

	it('buzz-in timer is not expired', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		expect(result.current.buzzInTimerIsExpired).toBe(false);
	});

	it('response timer is not active', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		expect(result.current.responseTimerIsActive).toBe(false);
	});

	it('contestant mode is clue-select', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		expect(result.current.contestantMode).toBe('clue-select');
	});
});

describe('selectClue', () => {
	it('sets the selected clue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		expect(result.current.selectedClue).toEqual(clue);
	});

	it('sets buzzInTimeLeft to 5', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		expect(result.current.buzzInTimeLeft).toBe(5);
	});

	it('activates the buzz-in timer', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		expect(result.current.buzzInTimerIsActive).toBe(true);
	});

	it('switches contestant mode to buzzer', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		expect(result.current.contestantMode).toBe('buzzer');
	});

	it('does not set responseTimeLeft', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		expect(result.current.responseTimeLeft).toBeUndefined();
	});
});

describe('abortClue', () => {
	it('clears the selected clue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.abortClue());
		expect(result.current.selectedClue).toBeNull();
	});

	it('clears the buzzer queue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.abortClue());
		expect(result.current.buzzerQueue).toHaveLength(0);
	});

	it('clears buzzInTimeLeft', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.abortClue());
		expect(result.current.buzzInTimeLeft).toBeUndefined();
	});

	it('clears responseTimeLeft', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.abortClue());
		expect(result.current.responseTimeLeft).toBeUndefined();
	});

	it('deactivates the response timer', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.abortClue());
		expect(result.current.responseTimerIsActive).toBe(false);
	});
});

describe('buzzIn', () => {
	it('adds the current session to the buzzer queue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		expect(result.current.buzzerQueue).toContain(SESSION_A);
	});

	it('clears buzzInTimeLeft', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		expect(result.current.buzzInTimeLeft).toBeUndefined();
	});

	it('deactivates the buzz-in timer', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		expect(result.current.buzzInTimerIsActive).toBe(false);
	});

	it('sets responseTimeLeft to 5', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		expect(result.current.responseTimeLeft).toBe(5);
	});

	it('activates the response timer', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		expect(result.current.responseTimerIsActive).toBe(true);
	});

	it('does not add the same session twice', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
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
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.resetBuzzers());
		expect(result.current.buzzerQueue).toHaveLength(0);
	});

	it('resets buzzInTimeLeft to 5', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.resetBuzzers());
		expect(result.current.buzzInTimeLeft).toBe(5);
	});

	it('clears responseTimeLeft', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.resetBuzzers());
		expect(result.current.responseTimeLeft).toBeUndefined();
	});

	it('deactivates the response timer', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.resetBuzzers());
		expect(result.current.responseTimerIsActive).toBe(false);
	});
});

describe('correctClueResponse', () => {
	it('clears the selected clue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
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
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.correctClueResponse());
		expect(result.current.scores[SESSION_A]).toBe(clue.value);
	});

	it('sets the active contestant to the winner', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.correctClueResponse());
		expect(result.current.activeContestant?.sessionId).toBe(SESSION_A);
	});

	it('adds the clue id to usedClueIds', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.correctClueResponse());
		expect(result.current.usedClueIds).toContain(clue.id);
	});

	it('accumulates points across multiple clues', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.correctClueResponse());
		act(() => result.current.selectClue(clue2));
		act(() => result.current.buzzIn());
		act(() => result.current.correctClueResponse());
		expect(result.current.scores[SESSION_A]).toBe(clue.value + clue2.value);
	});

	it('clears buzzInTimeLeft', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.correctClueResponse());
		expect(result.current.buzzInTimeLeft).toBeUndefined();
	});

	it('clears responseTimeLeft', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.correctClueResponse());
		expect(result.current.responseTimeLeft).toBeUndefined();
	});

	it('is a no-op when there is no selected clue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.buzzIn());
		act(() => result.current.correctClueResponse());
		expect(result.current.buzzerQueue).toHaveLength(1);
		expect(result.current.scores[SESSION_A]).toBeUndefined();
	});

	it('is a no-op when the buzzer queue is empty', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.correctClueResponse());
		expect(result.current.selectedClue).toEqual(clue);
		expect(result.current.scores[SESSION_A]).toBeUndefined();
	});
});

describe('wrongClueResponse', () => {
	it('deducts points from the first contestant in the queue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
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
		const { result, rerender } = renderHook(({ sessionId }) => useGamePhasePlayState(sessionId, GAME_ID, CONTESTANTS), {
			initialProps: { sessionId: SESSION_A },
		});
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		rerender({ sessionId: SESSION_B });
		act(() => result.current.buzzIn());
		rerender({ sessionId: SESSION_A });
		act(() => result.current.wrongClueResponse());
		expect(result.current.activeContestant?.sessionId).toBe(SESSION_B);
	});

	it('clears active contestant when the last contestant in queue answers wrong', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.wrongClueResponse());
		expect(result.current.activeContestant).toBeUndefined();
	});

	it('resets buzzInTimeLeft to 5 when the queue empties', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.wrongClueResponse());
		expect(result.current.buzzInTimeLeft).toBe(5);
	});

	it('clears responseTimeLeft when the queue empties', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.wrongClueResponse());
		expect(result.current.responseTimeLeft).toBeUndefined();
	});

	it('sets responseTimeLeft to 5 when the next contestant takes over', () => {
		const { result, rerender } = renderHook(({ sessionId }) => useGamePhasePlayState(sessionId, GAME_ID, CONTESTANTS), {
			initialProps: { sessionId: SESSION_A },
		});
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		rerender({ sessionId: SESSION_B });
		act(() => result.current.buzzIn());
		rerender({ sessionId: SESSION_A });
		act(() => result.current.wrongClueResponse());
		expect(result.current.responseTimeLeft).toBe(5);
	});

	it('clears buzzInTimeLeft when the next contestant takes over', () => {
		const { result, rerender } = renderHook(({ sessionId }) => useGamePhasePlayState(sessionId, GAME_ID, CONTESTANTS), {
			initialProps: { sessionId: SESSION_A },
		});
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		rerender({ sessionId: SESSION_B });
		act(() => result.current.buzzIn());
		rerender({ sessionId: SESSION_A });
		act(() => result.current.wrongClueResponse());
		expect(result.current.buzzInTimeLeft).toBeUndefined();
	});

	it('is a no-op when there is no selected clue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.buzzIn());
		act(() => result.current.wrongClueResponse());
		expect(result.current.buzzerQueue).toHaveLength(1);
		expect(result.current.scores[SESSION_A]).toBeUndefined();
	});

	it('is a no-op when the buzzer queue is empty', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.wrongClueResponse());
		expect(result.current.selectedClue).toEqual(clue);
		expect(result.current.scores[SESSION_A]).toBeUndefined();
	});
});

describe('expireClue', () => {
	it('clears the selected clue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.expireClue());
		expect(result.current.selectedClue).toBeNull();
	});

	it('clears the buzzer queue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.expireClue());
		expect(result.current.buzzerQueue).toHaveLength(0);
	});

	it('adds the clue id to usedClueIds', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.expireClue());
		expect(result.current.usedClueIds).toContain(clue.id);
	});

	it('clears buzzInTimeLeft', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.expireClue());
		expect(result.current.buzzInTimeLeft).toBeUndefined();
	});

	it('clears responseTimeLeft', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.expireClue());
		expect(result.current.responseTimeLeft).toBeUndefined();
	});

	it('is a no-op when there is no selected clue', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.buzzIn());
		act(() => result.current.expireClue());
		expect(result.current.buzzerQueue).toHaveLength(1);
	});
});

describe('usedClueIds', () => {
	it('does not add duplicate clue ids', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		act(() => result.current.correctClueResponse());
		act(() => result.current.selectClue(clue));
		act(() => result.current.expireClue());
		expect(result.current.usedClueIds.filter(id => id === clue.id)).toHaveLength(1);
	});
});

describe('buzzInTimerIsExpired', () => {
	it('is false when buzzInTimeLeft is greater than 0', () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue)); // sets to 5
		expect(result.current.buzzInTimerIsExpired).toBe(false);
	});
});

describe('buzz-in timer countdown', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it('decrements buzzInTimeLeft by 1 each second', async () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		expect(result.current.buzzInTimeLeft).toBe(5);

		await act(async () => {
			vi.advanceTimersByTime(1000);
		});
		expect(result.current.buzzInTimeLeft).toBe(4);

		await act(async () => {
			vi.advanceTimersByTime(1000);
		});
		expect(result.current.buzzInTimeLeft).toBe(3);
	});

	it('stops decrementing at 0', async () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));

		for (let i = 0; i < 6; i++) {
			await act(async () => {
				vi.advanceTimersByTime(1000);
			});
		}
		expect(result.current.buzzInTimeLeft).toBe(0);
	});

	it('buzzInTimerIsExpired becomes true when timer reaches 0', async () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));

		for (let i = 0; i < 5; i++) {
			await act(async () => {
				vi.advanceTimersByTime(1000);
			});
		}
		expect(result.current.buzzInTimerIsExpired).toBe(true);
	});
});

describe('response timer countdown', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it('decrements responseTimeLeft by 1 each second after buzzIn', async () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());
		expect(result.current.responseTimeLeft).toBe(5);

		await act(async () => {
			vi.advanceTimersByTime(1000);
		});
		expect(result.current.responseTimeLeft).toBe(4);

		await act(async () => {
			vi.advanceTimersByTime(1000);
		});
		expect(result.current.responseTimeLeft).toBe(3);
	});

	it('stops decrementing at 0', async () => {
		const { result } = renderHook(() => useGamePhasePlayState(SESSION_A, GAME_ID, CONTESTANTS));
		act(() => result.current.selectClue(clue));
		act(() => result.current.buzzIn());

		for (let i = 0; i < 6; i++) {
			await act(async () => {
				vi.advanceTimersByTime(1000);
			});
		}
		expect(result.current.responseTimeLeft).toBe(0);
	});
});
