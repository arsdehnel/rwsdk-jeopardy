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
		<div className="view-host">
			<h2>Scores / Buzzers</h2>
			<Scoreboard connections={connections} scores={scores} buzzerQueue={buzzerQueue} />
			<h2>Current Clue</h2>
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

			<h2>Game Options</h2>
			<button type="button" onClick={() => setupGame()}>
				Back to Setup
			</button>
			<button type="button" onClick={() => finishGame()}>
				End Game
			</button>
		</div>
	);
}
