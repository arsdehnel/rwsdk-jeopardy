import { useSyncedState } from 'rwsdk/use-synced-state/client';
import type { Clue, GamePhase } from '@/types';

export default function useGameState() {
	const [selectedClue, setSelectedClue] = useSyncedState<Clue | null>(null, 'selectedClue');
	const [gamePhase, setGamePhase] = useSyncedState<GamePhase>('setup', 'gamePhase');

	return {
		selectedClue,
		setSelectedClue,
		gamePhase,
		setGamePhase,
	};
}
