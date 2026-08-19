import type { RequestInfo } from 'rwsdk/worker';
import { KADProgress } from '@/components/design-system';
import { Scoreboard } from '@/components/play';
import type { GamePhasePlayState } from '@/hooks/use-game-phase-play-state';
import { DefaultLayout } from '@/layouts';
import { createNoopLogger } from '@/logger';
import { caughtError } from '../../../utils';

export default async function Pages__dev__games__play__display({ ctx }: RequestInfo): Promise<React.JSX.Element> {
	const gameId: string = crypto.randomUUID();
	const contestants = ['Abc', 'Def', 'Ghi'].map(name => ({
		id: crypto.randomUUID(),
		gameId: gameId,
		userId: null,
		score: null,
		sessionId: crypto.randomUUID(),
		name,
		createdAt: 'asdf',
		createdBy: crypto.randomUUID(),
		updatedAt: 'asdf',
		updatedBy: crypto.randomUUID(),
		deletedAt: null,
		deletedBy: null,
	}));

	const scores: Record<string, number> = contestants.reduce(
		(scores, contestant) => {
			scores[contestant.sessionId] = Math.floor(Math.random() * 1000);
			return scores;
		},
		{} as Record<string, number>,
	);

	// mock middleware-provided context
	const mockCtx = {
		session: {
			sessionId: crypto.randomUUID(),
			lastAccessedAt: Date.now(),
		},
		permissions: [],
		logger: createNoopLogger(),
	};

	const randomlySelectedContestant = contestants[Math.floor(Math.random() * contestants.length)];
	const mockSyncState: Pick<
		GamePhasePlayState,
		| 'buzzerQueue'
		| 'buzzInTimerIsActive'
		| 'buzzInTimeLeft'
		| 'scores'
		| 'selectedClue'
		| 'usedClueIds'
		| 'activeContestant'
		| 'correctClueResponse'
		| 'wrongClueResponse'
		| 'resetBuzzers'
		| 'expireClue'
		| 'abortClue'
	> = {
		buzzInTimerIsActive: true,
		buzzInTimeLeft: 3,
		buzzerQueue: [],
		scores,
		selectedClue: null,
		usedClueIds: [],
		activeContestant: randomlySelectedContestant,
		correctClueResponse: (): void => {},
		wrongClueResponse: (): void => {},
		resetBuzzers: (): void => {},
		expireClue: (): void => {},
		abortClue: (): void => {},
	};

	try {
		return (
			<DefaultLayout pageTitle="Dev Games Play Host" currentBasePage="dev" ctx={mockCtx}>
				<div className="view-host">
					<section>
						<h2>Scores / Buzzers</h2>
						<div className="host-section-content">
							<Scoreboard
								contestants={contestants}
								scores={scores}
								buzzerQueue={mockSyncState.buzzerQueue}
								activeContestant={mockSyncState.activeContestant}
							/>
						</div>
					</section>
					{mockSyncState.activeContestant && (
						<section>
							<h2>Active Contestant</h2>
							<div className="host-section-content">{mockSyncState.activeContestant?.name}</div>
						</section>
					)}
					{mockSyncState.buzzInTimerIsActive && (
						<section>
							<h2>Buzz-In timer</h2>
							<div className="host-section-content">
								{mockSyncState.buzzInTimeLeft ? (
									<KADProgress progressPcnt={(mockSyncState.buzzInTimeLeft / 5) * 100} />
								) : (
									<span>🚨 TIME'S UP 🚨</span>
								)}
							</div>
						</section>
					)}
					<section>
						<h2>Current Clue</h2>
						<div className="host-section-content">
							{mockSyncState.selectedClue ? (
								<>
									<h3>Clue</h3>
									<p>{mockSyncState.selectedClue.text}</p>
									<h3>Response</h3>
									<p>{mockSyncState.selectedClue.response}</p>
								</>
							) : (
								<p>Contestant choosing clue...</p>
							)}
						</div>
					</section>
					<section>
						<h2>Clue Actions</h2>
						<div className="host-section-content">
							{mockSyncState.buzzerQueue.length > 0 && (
								<>
									<button type="submit" onClick={(): void => mockSyncState.correctClueResponse()}>
										✅ Response was correct, award points and reset buzzers
									</button>
									<button type="submit" onClick={(): void => mockSyncState.wrongClueResponse()}>
										❌ Response was wrong, move to next in line
									</button>
									<button type="submit" onClick={(): void => mockSyncState.resetBuzzers()}>
										⚠️ Something went wrong, reset buzzers
									</button>
								</>
							)}
							{mockSyncState.selectedClue && (
								<button type="submit" onClick={(): void => mockSyncState.expireClue()}>
									❌ Nobody got it, expire clue
								</button>
							)}

							<button
								type="button"
								className="clue-overlay-button"
								onClick={(): void => {
									mockSyncState.abortClue();
								}}
							>
								⚠️ Click this if something went wrong and you need to go back to the board
							</button>
						</div>
					</section>
				</div>
			</DefaultLayout>
		);
	} catch (err) {
		return caughtError(err, ctx.logger);
	}
}
