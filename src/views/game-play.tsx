'use client';
import classnames from 'classnames';
import { useEffect } from 'react';
import { KADProgress } from '@/components/design-system';
import { Board, Buzzer, ClueOverlay, ClueSelect, Scoreboard } from '@/components/play';
import useGamePhasePlayState from '@/hooks/use-game-phase-play-state';
import type { CategoryInGame, Contestant, Role } from '@/types';

export default function ViewGamePlay({
	currentUserRole,
	contestants,
	gameId,
	sessionId,
	categories,
}: {
	currentUserRole: Role;
	contestants: Contestant[];
	gameId: string;
	sessionId: string;
	categories: CategoryInGame[];
}): React.ReactNode {
	const {
		selectedClue,
		buzzerQueue,
		usedClueIds,
		scores,
		activeContestant,
		buzzInTimeLeft,
		correctClueResponse,
		wrongClueResponse,
		resetBuzzers,
		abortClue,
		selectClue,
		buzzIn,
		expireClue,
		decreaseBuzzerTimeLeft,
	} = useGamePhasePlayState(sessionId, gameId);

	useEffect(() => {
		if (!buzzInTimeLeft) return;
		const timer = setTimeout(() => {
			decreaseBuzzerTimeLeft();
		}, 1000);
		return (): void => clearTimeout(timer);
	}, [buzzInTimeLeft, decreaseBuzzerTimeLeft]);

	const activeConnection = activeContestant ? contestants.find(c => c.sessionId === activeContestant) : undefined;
	const timerIsActive = typeof buzzInTimeLeft !== 'undefined';
	const contestantMode = selectedClue ? 'buzzer' : 'clue-select';

	// game mode PLAYING
	if (currentUserRole === 'display') {
		return (
			<div className="view-display">
				<Scoreboard contestants={contestants} scores={scores} buzzerQueue={buzzerQueue} />
				<ClueOverlay selectedClue={selectedClue} />
				<Board categories={categories} usedClueIds={usedClueIds} />
			</div>
		);
	}

	if (currentUserRole === 'host') {
		return (
			<div className="view-host">
				<section>
					<h2>Scores / Buzzers</h2>
					<div className="host-section-content">
						<Scoreboard contestants={contestants} scores={scores} buzzerQueue={buzzerQueue} />
					</div>
				</section>
				{activeContestant && (
					<section>
						<h2>Active Contestant</h2>
						<div className="host-section-content">{activeConnection?.name}</div>
					</section>
				)}

				{timerIsActive && (
					<section>
						<h2>Buzz-In timer</h2>
						<div className="host-section-content">
							{buzzInTimeLeft ? <KADProgress progressPcnt={(buzzInTimeLeft / 5) * 100} /> : <span>🚨 TIME'S UP 🚨</span>}
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
			</div>
		);
	}

	return (
		<div className={classnames('view-contestant', `view-contestant--${contestantMode}`)}>
			{selectedClue === null ? (
				<ClueSelect
					selectClue={selectClue}
					categories={categories}
					usedClueIds={usedClueIds}
					activeContestant={activeContestant}
					sessionId={sessionId}
				/>
			) : (
				<Buzzer buzzIn={buzzIn} buzzerQueue={buzzerQueue} sessionId={sessionId} buzzInTimeLeft={buzzInTimeLeft} />
			)}
		</div>
	);
}
