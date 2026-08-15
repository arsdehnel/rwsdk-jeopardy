import { useEffect } from 'react';
import { navigate } from 'rwsdk/client';
import { useSyncedState } from 'rwsdk/use-synced-state/client';
import { gamePhaseEnum } from '@/models';
import type { GamePhaseEnum } from '@/types';

type GamePhaseHookState = {
	phase: GamePhaseEnum;
};

export default function useGamePhase(gameId: string, defaultPhase: GamePhaseEnum): GamePhaseHookState {
	const [gamePhase] = useSyncedState<GamePhaseEnum>(defaultPhase, 'gamePhase', gameId);

	useEffect(() => {
		gamePhaseEnum.forEach((phase: string) => {
			if (phase !== gamePhase) {
				document.querySelector('body')?.classList.remove(`game-phase-${phase.toLowerCase()}`);
			} else {
				document.querySelector('body')?.classList.add(`game-phase-${phase.toLowerCase()}`);
			}
		});
		navigate(`/games/${gameId}/${gamePhase.toLowerCase()}`, { history: 'replace' });
	}, [gamePhase, gameId]);

	return {
		phase: gamePhase,
	};
}
