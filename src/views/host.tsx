'use client';
import HostClueDisplay from '@/app/components/host-clue-display';
import Scoreboard from '@/app/components/scoreboard';
import type { Clue, ClueState, Connections, GameState } from '@/types';

export default function HostView({
	connections,
	clueState,
	setClueState,
	selectedClue,
	buzzedInPlayer,
	setBuzzedInPlayer,
	correctClueResponse,
	setGameState,
}: {
	connections: Connections;
	clueState: ClueState;
	setClueState: (clueState: ClueState) => void;
	selectedClue: Clue | null;
	buzzedInPlayer: string | null;
	setBuzzedInPlayer: (player: string | null) => void;
	correctClueResponse: (player: string | null, clue: Clue) => void;
	setGameState: (gameState: GameState) => void;
}) {
	return (
		<>
			<p>Role: Host</p>
			<Scoreboard connections={connections} />
			<button type="button" onClick={() => setGameState('setup')}>
				Back to Setup
			</button>
			<button type="button" onClick={() => setGameState('finished')}>
				End Game
			</button>
			{clueState === 'initial' ? (
				<p>Player choosing clue...</p>
			) : (
				selectedClue && (
					<HostClueDisplay
						selectedClue={selectedClue}
						setClueState={setClueState}
						buzzedInPlayer={buzzedInPlayer}
						setBuzzedInPlayer={setBuzzedInPlayer}
						correctClueResponse={correctClueResponse}
					/>
				)
			)}
		</>
	);
}
