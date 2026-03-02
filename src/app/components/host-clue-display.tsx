'use client';

import type { Clue, ClueState } from '@/types';

export default function HostClueDisplay({
	selectedClue,
	setClueState,
	buzzedInPlayer,
	setBuzzedInPlayer,
	correctClueResponse,
}: {
	selectedClue: Clue;
	setClueState: (clueState: ClueState) => void;
	buzzedInPlayer: string | null;
	setBuzzedInPlayer: (player: string | null) => void;
	correctClueResponse: (player: string | null, clue: Clue) => void;
}) {
	return (
		<div>
			<h2>Clue</h2>
			<p>{selectedClue.clue}</p>
			<h2>Response</h2>
			<p>{selectedClue.response}</p>
			<button
				type="button"
				className="clue-overlay-button"
				onClick={() => {
					setClueState('initial');
				}}
			>
				Back to Board
			</button>
			{buzzedInPlayer ? <p>{buzzedInPlayer} has buzzed in!</p> : <p>No one has buzzed in yet.</p>}
			<button type="submit" onClick={() => setBuzzedInPlayer(null)}>
				Response was wrong, reset buzzers
			</button>
			<button type="submit" onClick={() => correctClueResponse(buzzedInPlayer, selectedClue)}>
				Response was correct, award points and reset buzzers
			</button>
		</div>
	);
}
