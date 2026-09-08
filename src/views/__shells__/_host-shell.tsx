'use client';
import { KADProgress } from '@/components/design-system';
import { Scoreboard } from '@/components/play';
import type { ClueInGame, GameContestantDBRead } from '@/types';

export default function HostShell({
	contestants,
	scores,
	selectedClue = null,
	buzzerQueue = [],
	activeContestant,
	buzzInTimerIsActive = false,
	buzzInTimeLeft,
	responseTimerIsActive = false,
	responseTimeLeft,
}: {
	contestants: GameContestantDBRead[];
	scores: Record<string, number>;
	selectedClue?: ClueInGame | null;
	buzzerQueue?: string[];
	activeContestant?: GameContestantDBRead;
	buzzInTimerIsActive?: boolean;
	buzzInTimeLeft?: number;
	responseTimerIsActive?: boolean;
	responseTimeLeft?: number;
}): React.ReactNode {
	return (
		<div className="view-host">
			<section>
				<h2>Scores / Buzzers</h2>
				<div className="host-section-content">
					<Scoreboard contestants={contestants} scores={scores} buzzerQueue={buzzerQueue} activeContestant={activeContestant} />
				</div>
			</section>
			{activeContestant && (
				<section>
					<h2>Active Contestant</h2>
					<div className="host-section-content">{activeContestant.name}</div>
				</section>
			)}
			{buzzInTimerIsActive && (
				<section>
					<h2>Buzz-In timer</h2>
					<div className="host-section-content">
						{buzzInTimeLeft ? <KADProgress progressPcnt={(buzzInTimeLeft / 5) * 100} /> : <span>🚨 TIME'S UP 🚨</span>}
					</div>
				</section>
			)}
			{responseTimerIsActive && (
				<section>
					<h2>Response timer</h2>
					<div className="host-section-content">
						{responseTimeLeft ? <KADProgress progressPcnt={(responseTimeLeft / 5) * 100} /> : <span>🚨 TIME'S UP 🚨</span>}
					</div>
				</section>
			)}
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
							<button type="submit">✅ Response was correct, award points and reset buzzers</button>
							<button type="submit">❌ Response was wrong, move to next in line</button>
							<button type="submit">⚠️ Something went wrong, reset buzzers</button>
						</>
					)}
					{selectedClue && <button type="submit">❌ Nobody got it, expire clue</button>}
					<button type="button" className="clue-overlay-button">
						⚠️ Click this if something went wrong and you need to go back to the board
					</button>
				</div>
			</section>
		</div>
	);
}
