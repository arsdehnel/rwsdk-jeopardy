'use client';
import HostClueDisplay from '@/components/host-clue-display';
import Scoreboard from '@/components/scoreboard';
import type { Clue, Connections } from '@/types';

export default function HostView({
	connections,
	selectedClue,
	buzzerQueue,
	scores,
	abortClue,
	resetBuzzers,
	correctClueResponse,
	wrongClueResponse,
	setupGame,
	finishGame,
	expireClue,
}: {
	connections: Connections;
	selectedClue: Clue | null;
	buzzerQueue: string[];
	scores: Record<string, number>;
	abortClue: () => void;
	resetBuzzers: () => void;
	correctClueResponse: () => void;
	wrongClueResponse: () => void;
	setupGame: () => void;
	finishGame: () => void;
	expireClue: () => void;
}) {
	return (
		<>
			<p>Role: Host</p>
			<Scoreboard connections={connections} scores={scores} />
			<button type="button" onClick={() => setupGame()}>
				Back to Setup
			</button>
			<button type="button" onClick={() => finishGame()}>
				End Game
			</button>
			{selectedClue ? (
				<HostClueDisplay
					selectedClue={selectedClue}
					buzzerQueue={buzzerQueue}
					abortClue={abortClue}
					expireClue={expireClue}
					resetBuzzers={resetBuzzers}
					correctClueResponse={correctClueResponse}
					wrongClueResponse={wrongClueResponse}
				/>
			) : (
				<p>Contestant choosing clue...</p>
			)}
		</>
	);
}
