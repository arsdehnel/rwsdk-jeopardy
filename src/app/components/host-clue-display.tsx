'use client';

import type { Clue } from '@/types';

export default function HostClueDisplay({
	selectedClue,
	buzzedInPlayer,
	setSelectedClue,
	setBuzzedInPlayer,
	correctClueResponse,
}: {
	selectedClue: Clue;
	buzzedInPlayer: string | null;
	setSelectedClue: (clue: Clue | null) => void;
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
					setSelectedClue(null);
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
