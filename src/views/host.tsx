'use client';
import HostClueDisplay from '@/app/components/host-clue-display';
import Scoreboard from '@/app/components/scoreboard';
import type { Clue, Connections } from '@/types';

export default function HostView({
	connections,
	selectedClue,
	buzzedInSessionId,
	abortClue,
	resetBuzzers,
	correctClueResponse,
	setupGame,
	finishGame,
}: {
	connections: Connections;
	selectedClue: Clue | null;
	buzzedInSessionId: string | null;
	abortClue: () => void;
	resetBuzzers: () => void;
	correctClueResponse: (player: string | null, clue: Clue) => void;
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
					buzzedInSessionId={buzzedInSessionId}
					abortClue={abortClue}
					resetBuzzers={resetBuzzers}
					correctClueResponse={correctClueResponse}
				/>
			) : (
				<p>Player choosing clue...</p>
			)}
		</>
	);
}
