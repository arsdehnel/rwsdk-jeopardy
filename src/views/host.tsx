'use client';
import HostClueDisplay from '@/app/components/host-clue-display';
import Scoreboard from '@/app/components/scoreboard';
import type { Clue, Connections, GamePhase } from '@/types';

export default function HostView({
	connections,
	selectedClue,
	buzzedInPlayer,
	setSelectedClue,
	setBuzzedInPlayer,
	correctClueResponse,
	setGamePhase,
}: {
	connections: Connections;
	selectedClue: Clue | null;
	buzzedInPlayer: string | null;
	setSelectedClue: (clue: Clue | null) => void;
	setBuzzedInPlayer: (player: string | null) => void;
	correctClueResponse: (player: string | null, clue: Clue) => void;
	setGamePhase: (gamePhase: GamePhase) => void;
}) {
	return (
		<>
			<p>Role: Host</p>
			<Scoreboard connections={connections} />
			<button type="button" onClick={() => setGamePhase('setup')}>
				Back to Setup
			</button>
			<button type="button" onClick={() => setGamePhase('finished')}>
				End Game
			</button>
			{selectedClue ? (
				<HostClueDisplay
					selectedClue={selectedClue}
					buzzedInPlayer={buzzedInPlayer}
					setSelectedClue={setSelectedClue}
					setBuzzedInPlayer={setBuzzedInPlayer}
					correctClueResponse={correctClueResponse}
				/>
			) : (
				<p>Player choosing clue...</p>
			)}
		</>
	);
}
