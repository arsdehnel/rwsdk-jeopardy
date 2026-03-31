'use client';

import type { Clue } from '@/types';

export default function HostClueDisplay({
	selectedClue,
	buzzerQueue,
	abortClue,
	expireClue,
	resetBuzzers,
	correctClueResponse,
	wrongClueResponse,
}: {
	selectedClue: Clue;
	buzzerQueue: string[];
	abortClue: () => void;
	expireClue: () => void;
	resetBuzzers: () => void;
	correctClueResponse: () => void;
	wrongClueResponse: () => void;
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
			{buzzerQueue.length > 0 ? (
				<>
					<p>{buzzerQueue[0]} has buzzed in!</p>
					<button type="submit" onClick={() => resetBuzzers()}>
						Something weng wrong, reset buzzers
					</button>
					<button type="submit" onClick={() => expireClue()}>
						Nobody got it, expire clue
					</button>
					<button type="submit" onClick={() => wrongClueResponse()}>
						Response was wrong, move to next in line
					</button>
					<button type="submit" onClick={() => correctClueResponse()}>
						Response was correct, award points and reset buzzers
					</button>
				</>
			) : (
				<p>No one has buzzed in yet.</p>
			)}
		</div>
	);
}
