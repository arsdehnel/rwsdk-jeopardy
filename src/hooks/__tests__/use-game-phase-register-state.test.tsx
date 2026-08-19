import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import useGamePhaseRegisterState from '@/hooks/use-game-phase-register-state';

const GAME_ID = 'test-game';
const SESSION_A = 'session-a';
const SESSION_B = 'session-b';

describe('registerAsDisplay', () => {
	it('registers the current session as display', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsDisplay());
		expect(result.current.display).toBe(SESSION_A);
	});

	it('sets hasDisplay to true', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsDisplay());
		expect(result.current.hasDisplay).toBe(true);
	});

	it('throws when already registered as display', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsDisplay());
		expect(() => act(() => result.current.registerAsDisplay())).toThrow();
	});

	it('throws when already registered as host', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsHost());
		expect(() => act(() => result.current.registerAsDisplay())).toThrow();
	});

	it('throws when already registered as contestant', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsContestant('Alice', undefined));
		expect(() => act(() => result.current.registerAsDisplay())).toThrow();
	});

	it('throws when another session is already the display', () => {
		const { result, rerender } = renderHook(({ sessionId }) => useGamePhaseRegisterState(sessionId, GAME_ID), {
			initialProps: { sessionId: SESSION_A },
		});
		act(() => result.current.registerAsDisplay());
		rerender({ sessionId: SESSION_B });
		expect(() => act(() => result.current.registerAsDisplay())).toThrow();
	});
});

describe('unregisterAsDisplay', () => {
	it('clears display', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsDisplay());
		act(() => result.current.unregisterAsDisplay());
		expect(result.current.display).toBeUndefined();
	});

	it('sets hasDisplay to false', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsDisplay());
		act(() => result.current.unregisterAsDisplay());
		expect(result.current.hasDisplay).toBe(false);
	});

	it('silently succeeds when not registered as anything', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		expect(() => act(() => result.current.unregisterAsDisplay())).not.toThrow();
	});

	it('silently succeeds and leaves host intact when registered as host', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsHost());
		act(() => result.current.unregisterAsDisplay());
		expect(result.current.host).toBe(SESSION_A);
	});

	it('silently succeeds and leaves contestants intact when registered as contestant', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsContestant('Alice', undefined));
		act(() => result.current.unregisterAsDisplay());
		expect(result.current.contestants).toHaveLength(1);
	});
});

describe('registerAsHost', () => {
	it('registers the current session as host', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsHost());
		expect(result.current.host).toBe(SESSION_A);
	});

	it('sets hasHost to true', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsHost());
		expect(result.current.hasHost).toBe(true);
	});

	it('throws when already registered as host', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsHost());
		expect(() => act(() => result.current.registerAsHost())).toThrow();
	});

	it('throws when already registered as display', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsDisplay());
		expect(() => act(() => result.current.registerAsHost())).toThrow();
	});

	it('throws when already registered as contestant', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsContestant('Alice', undefined));
		expect(() => act(() => result.current.registerAsHost())).toThrow();
	});

	it('throws when another session is already the host', () => {
		const { result, rerender } = renderHook(({ sessionId }) => useGamePhaseRegisterState(sessionId, GAME_ID), {
			initialProps: { sessionId: SESSION_A },
		});
		act(() => result.current.registerAsHost());
		rerender({ sessionId: SESSION_B });
		expect(() => act(() => result.current.registerAsHost())).toThrow();
	});
});

describe('unregisterAsHost', () => {
	it('clears host', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsHost());
		act(() => result.current.unregisterAsHost());
		expect(result.current.host).toBeUndefined();
	});

	it('sets hasHost to false', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsHost());
		act(() => result.current.unregisterAsHost());
		expect(result.current.hasHost).toBe(false);
	});

	it('silently succeeds when not registered as anything', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		expect(() => act(() => result.current.unregisterAsHost())).not.toThrow();
	});

	it('silently succeeds and leaves display intact when registered as display', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsDisplay());
		act(() => result.current.unregisterAsHost());
		expect(result.current.display).toBe(SESSION_A);
	});

	it('silently succeeds and leaves contestants intact when registered as contestant', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsContestant('Alice', undefined));
		act(() => result.current.unregisterAsHost());
		expect(result.current.contestants).toHaveLength(1);
	});
});

describe('registerAsContestant', () => {
	it('adds the current session to contestants', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsContestant('Alice', undefined));
		expect(result.current.contestants).toContainEqual({ sessionId: SESSION_A, name: 'Alice', userId: undefined });
	});

	it('stores the provided userId', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsContestant('Alice', 'user-1'));
		expect(result.current.contestants[0].userId).toBe('user-1');
	});

	it('allows multiple sessions to register as contestants simultaneously', () => {
		const { result, rerender } = renderHook(({ sessionId }) => useGamePhaseRegisterState(sessionId, GAME_ID), {
			initialProps: { sessionId: SESSION_A },
		});
		act(() => result.current.registerAsContestant('Alice', undefined));
		rerender({ sessionId: SESSION_B });
		act(() => result.current.registerAsContestant('Bob', undefined));
		expect(result.current.contestants).toHaveLength(2);
	});

	it('allows two sessions to register with the same name', () => {
		const { result, rerender } = renderHook(({ sessionId }) => useGamePhaseRegisterState(sessionId, GAME_ID), {
			initialProps: { sessionId: SESSION_A },
		});
		act(() => result.current.registerAsContestant('Alice', undefined));
		rerender({ sessionId: SESSION_B });
		act(() => result.current.registerAsContestant('Alice', undefined));
		expect(result.current.contestants).toHaveLength(2);
	});

	it('throws when already registered as contestant', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsContestant('Alice', undefined));
		expect(() => act(() => result.current.registerAsContestant('Alice', undefined))).toThrow();
	});

	it('throws when already registered as host', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsHost());
		expect(() => act(() => result.current.registerAsContestant('Alice', undefined))).toThrow();
	});

	it('throws when already registered as display', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsDisplay());
		expect(() => act(() => result.current.registerAsContestant('Alice', undefined))).toThrow();
	});
});

describe('unregisterAsContestant', () => {
	it('removes the current session from contestants', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsContestant('Alice', undefined));
		act(() => result.current.unregisterAsContestant());
		expect(result.current.contestants).toHaveLength(0);
	});

	it('leaves other contestants intact', () => {
		const { result, rerender } = renderHook(({ sessionId }) => useGamePhaseRegisterState(sessionId, GAME_ID), {
			initialProps: { sessionId: SESSION_A },
		});
		act(() => result.current.registerAsContestant('Alice', undefined));
		rerender({ sessionId: SESSION_B });
		act(() => result.current.registerAsContestant('Bob', undefined));
		act(() => result.current.unregisterAsContestant());
		expect(result.current.contestants).toHaveLength(1);
		expect(result.current.contestants[0].sessionId).toBe(SESSION_A);
	});

	it('silently succeeds when not registered as anything', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		expect(() => act(() => result.current.unregisterAsContestant())).not.toThrow();
	});

	it('silently succeeds and leaves display intact when registered as display', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsDisplay());
		act(() => result.current.unregisterAsContestant());
		expect(result.current.display).toBe(SESSION_A);
	});

	it('silently succeeds and leaves host intact when registered as host', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsHost());
		act(() => result.current.unregisterAsContestant());
		expect(result.current.host).toBe(SESSION_A);
	});
});

describe('currentUserRole', () => {
	it('is undefined before any registration', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		expect(result.current.currentUserRole).toBeUndefined();
	});

	it('is display after registerAsDisplay', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsDisplay());
		expect(result.current.currentUserRole).toBe('display');
	});

	it('is host after registerAsHost', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsHost());
		expect(result.current.currentUserRole).toBe('host');
	});

	it('is contestant after registerAsContestant', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsContestant('Alice', undefined));
		expect(result.current.currentUserRole).toBe('contestant');
	});

	it('is undefined after unregistering as display', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsDisplay());
		act(() => result.current.unregisterAsDisplay());
		expect(result.current.currentUserRole).toBeUndefined();
	});

	it('is undefined after unregistering as host', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsHost());
		act(() => result.current.unregisterAsHost());
		expect(result.current.currentUserRole).toBeUndefined();
	});

	it('is undefined after unregistering as contestant', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		act(() => result.current.registerAsContestant('Alice', undefined));
		act(() => result.current.unregisterAsContestant());
		expect(result.current.currentUserRole).toBeUndefined();
	});
});

describe('initial state', () => {
	it('has no display', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		expect(result.current.display).toBeUndefined();
		expect(result.current.hasDisplay).toBe(false);
	});

	it('has no host', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		expect(result.current.host).toBeUndefined();
		expect(result.current.hasHost).toBe(false);
	});

	it('has no contestants', () => {
		const { result } = renderHook(() => useGamePhaseRegisterState(SESSION_A, GAME_ID));
		expect(result.current.contestants).toHaveLength(0);
	});
});
