'use client';
import Scoreboard from '@/components/scoreboard';
import type { ClueInGame, Connections } from '@/types';

export default function HostView({
	connections,
	selectedClue,
	buzzerQueue,
	scores,
	activeContestant,
	abortClue,
	resetBuzzers,
	correctClueResponse,
	wrongClueResponse,
	setupGame,
	finishGame,
	expireClue,
}: {
	connections: Connections;
	selectedClue: ClueInGame | null;
	buzzerQueue: string[];
	scores: Record<string, number>;
	activeContestant: string | undefined;
	abortClue: () => void;
	resetBuzzers: () => void;
	correctClueResponse: () => void;
	wrongClueResponse: () => void;
	setupGame: () => void;
	finishGame: () => void;
	expireClue: () => void;
}): React.ReactNode {
	const activeConnection = activeContestant ? connections.contestants.find(c => c.id === activeContestant) : undefined;
	return (
		<div className="view-host">
			<section>
				<h2>Scores / Buzzers</h2>
				<div className="host-section-content">
					<Scoreboard connections={connections} scores={scores} buzzerQueue={buzzerQueue} />
				</div>
				<div>
					<strong>Active</strong>
					{activeContestant}
				</div>
			</section>
			<section>
				<h2>Active Contestant</h2>
				<div className="host-section-content">{activeConnection?.name}</div>
			</section>
			<section>
				<h2>Current Clue</h2>
				<div className="host-section-content">
					{selectedClue ? (
						<>
							<h3>Clue</h3>
							<p>{selectedClue.text}</p>
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
							<button type="submit" onClick={(): void => correctClueResponse()}>
								✅ Response was correct, award points and reset buzzers
							</button>
							<button type="submit" onClick={(): void => wrongClueResponse()}>
								❌ Response was wrong, move to next in line
							</button>
							<button type="submit" onClick={(): void => resetBuzzers()}>
								⚠️ Something went wrong, reset buzzers
							</button>
						</>
					)}
					{selectedClue && (
						<button type="submit" onClick={(): void => expireClue()}>
							❌ Nobody got it, expire clue
						</button>
					)}

					<button
						type="button"
						className="clue-overlay-button"
						onClick={(): void => {
							abortClue();
						}}
					>
						⚠️ Click this if something went wrong and you need to go back to the board
					</button>
				</div>
			</section>
			<section>
				<h2>Game Options</h2>
				<div className="host-section-content">
					<button type="button" onClick={(): void => setupGame()}>
						⬅️ Back to Setup
					</button>
					<button type="button" onClick={(): void => finishGame()}>
						🎉 End Game
					</button>
				</div>
			</section>
		</div>
	);
}
