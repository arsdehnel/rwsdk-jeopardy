'use client';

import type { Clue } from '@/types';

export default function HostClueDisplay({
	selectedClue,
	buzzedInSessionId,
	abortClue,
	resetBuzzers,
	correctClueResponse,
}: {
	selectedClue: Clue;
	buzzedInSessionId: string | null;
	abortClue: () => void;
	resetBuzzers: () => void;
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
					abortClue();
				}}
			>
				Back to Board
			</button>
			{buzzedInSessionId ? <p>{buzzedInSessionId} has buzzed in!</p> : <p>No one has buzzed in yet.</p>}
			<button type="submit" onClick={() => resetBuzzers()}>
				Response was wrong, reset buzzers
			</button>
			<button type="submit" onClick={() => correctClueResponse(buzzedInSessionId, selectedClue)}>
				Response was correct, award points and reset buzzers
			</button>
		</div>
	);
}
