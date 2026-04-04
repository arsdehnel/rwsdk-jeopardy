'use client';
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
			<section>
				<h2>Scores / Buzzers</h2>
				<div className="host-section-content">
					<Scoreboard connections={connections} scores={scores} buzzerQueue={buzzerQueue} />
				</div>
			</section>
			<section>
				<h2>Current Clue</h2>
				<div className="host-section-content">
					{selectedClue ? (
						<>
							<h3>Clue</h3>
							<p>{selectedClue.clue}</p>
							<h3>Response</h3>
							<p>{selectedClue.response}</p>
						</>
					) : (
						<p>Contestant choosing clue...</p>
					)}
				</div>
			</section>
			<section>
				<h2>Clue Actions</h2>
				<div className="host-section-content">
					{buzzerQueue.length > 0 && (
						<>
							<button type="submit" onClick={() => correctClueResponse()}>
								✅ Response was correct, award points and reset buzzers
							</button>
							<button type="submit" onClick={() => wrongClueResponse()}>
								❌ Response was wrong, move to next in line
							</button>
							<button type="submit" onClick={() => resetBuzzers()}>
								⚠️ Something went wrong, reset buzzers
							</button>
							<button type="submit" onClick={() => expireClue()}>
								⚠️ Nobody got it, expire clue
							</button>
						</>
					)}
					<button
						type="button"
						className="clue-overlay-button"
						onClick={() => {
							abortClue();
						}}
					>
						⚠️ Oops, something went wrong, go back to the board
					</button>
				</div>
			</section>
			<section>
				<h2>Game Options</h2>
				<div className="host-section-content">
					<button type="button" onClick={() => setupGame()}>
						⬅️ Back to Setup
					</button>
					<button type="button" onClick={() => finishGame()}>
						🎉 End Game
					</button>
				</div>
			</section>
		</div>
	);
}
