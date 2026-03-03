import { useSyncedState } from 'rwsdk/use-synced-state/client';
import type { Clue } from '@/types';

export default function useGameState() {
	const [selectedClue, setSelectedClue] = useSyncedState<Clue | null>(null, 'selectedClue');

	return {
		selectedClue,
		setSelectedClue,
	};
}
