import { act, renderHook } from '@testing-library/react';
import { navigate } from 'rwsdk/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useGamePhase from '@/hooks/use-game-phase';

const GAME_ID = 'test-game-id';

describe('useGamePhase', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		document.body.className = '';
	});

	afterEach(() => {
		document.body.className = '';
	});

	describe('return value', () => {
		it('returns the default phase', () => {
			const { result } = renderHook(() => useGamePhase(GAME_ID, 'REGISTER'));
			expect(result.current.phase).toBe('REGISTER');
		});

		it('returns PLAY when initialized with PLAY', () => {
			const { result } = renderHook(() => useGamePhase(GAME_ID, 'PLAY'));
			expect(result.current.phase).toBe('PLAY');
		});
	});

	describe('navigation', () => {
		it('navigates to the correct URL for REGISTER phase', () => {
			renderHook(() => useGamePhase(GAME_ID, 'REGISTER'));
			expect(navigate).toHaveBeenCalledWith(`/games/${GAME_ID}/register`, { history: 'replace' });
		});

		it('navigates to the correct URL for PLAY phase', () => {
			renderHook(() => useGamePhase(GAME_ID, 'PLAY'));
			expect(navigate).toHaveBeenCalledWith(`/games/${GAME_ID}/play`, { history: 'replace' });
		});

		it('navigates to the correct URL for SETUP phase', () => {
			renderHook(() => useGamePhase(GAME_ID, 'SETUP'));
			expect(navigate).toHaveBeenCalledWith(`/games/${GAME_ID}/setup`, { history: 'replace' });
		});

		it('navigates to the correct URL for FINISH phase', () => {
			renderHook(() => useGamePhase(GAME_ID, 'FINISH'));
			expect(navigate).toHaveBeenCalledWith(`/games/${GAME_ID}/finish`, { history: 'replace' });
		});

		it('navigates again when gameId changes', () => {
			const { rerender } = renderHook(({ gameId }) => useGamePhase(gameId, 'PLAY'), {
				initialProps: { gameId: 'game-1' },
			});
			rerender({ gameId: 'game-2' });
			expect(navigate).toHaveBeenCalledWith('/games/game-2/play', { history: 'replace' });
		});

		it('uses history replace not push', () => {
			renderHook(() => useGamePhase(GAME_ID, 'REGISTER'));
			expect(navigate).toHaveBeenCalledWith(expect.any(String), { history: 'replace' });
		});
	});

	describe('body class management', () => {
		it('adds the correct class for the current phase', () => {
			renderHook(() => useGamePhase(GAME_ID, 'REGISTER'));
			expect(document.body.classList.contains('game-phase-register')).toBe(true);
		});

		it('adds game-phase-play class for PLAY phase', () => {
			renderHook(() => useGamePhase(GAME_ID, 'PLAY'));
			expect(document.body.classList.contains('game-phase-play')).toBe(true);
		});

		it('removes classes for phases other than the current one', () => {
			document.body.classList.add('game-phase-play');
			renderHook(() => useGamePhase(GAME_ID, 'REGISTER'));
			expect(document.body.classList.contains('game-phase-play')).toBe(false);
		});

		it('does not add classes for inactive phases', () => {
			renderHook(() => useGamePhase(GAME_ID, 'REGISTER'));
			expect(document.body.classList.contains('game-phase-play')).toBe(false);
			expect(document.body.classList.contains('game-phase-setup')).toBe(false);
			expect(document.body.classList.contains('game-phase-finish')).toBe(false);
		});

		it('retains the correct class after gameId changes', () => {
			const { rerender } = renderHook(({ gameId }) => useGamePhase(gameId, 'PLAY'), {
				initialProps: { gameId: 'game-1' },
			});
			expect(document.body.classList.contains('game-phase-play')).toBe(true);
			rerender({ gameId: 'game-2' });
			expect(document.body.classList.contains('game-phase-play')).toBe(true);
		});
	});
});
