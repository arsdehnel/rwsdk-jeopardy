'use client';
import HostClueDisplay from '@/app/components/host-clue-display';
import Scoreboard from '@/app/components/scoreboard';
import type { Clue, Connections } from '@/types';

export default function HostView({
	connections,
	selectedClue,
	buzzerQueue,
	abortClue,
	resetBuzzers,
	correctClueResponse,
	wrongClueResponse,
	setupGame,
	finishGame,
}: {
	connections: Connections;
	selectedClue: Clue | null;
	buzzerQueue: string[];
	abortClue: () => void;
	resetBuzzers: () => void;
	correctClueResponse: (player: string, clue: Clue) => void;
	wrongClueResponse: () => void;
	setupGame: () => void;
	finishGame: () => void;
}) {
	return (
		<>
			<p>Role: Host</p>
			<Scoreboard connections={connections} />
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
					resetBuzzers={resetBuzzers}
					correctClueResponse={correctClueResponse}
					wrongClueResponse={wrongClueResponse}
				/>
			) : (
				<p>Player choosing clue...</p>
			)}
		</>
	);
}
