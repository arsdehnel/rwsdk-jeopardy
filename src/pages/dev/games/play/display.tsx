import type { RequestInfo } from 'rwsdk/worker';
import { Board, ClueOverlay, Scoreboard } from '@/components/play';
import type { GamePhasePlayState } from '@/hooks/use-game-phase-play-state';
import SetupLayout from '@/layouts/setup';
import { createNoopLogger } from '@/logger';
import type { CategoryInGame, GameWithEverything } from '@/types';
import { caughtError } from '../../../utils';

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

const categories: CategoryInGame[] = ['A', 'B', 'C', 'D', 'E', 'F'].map(ctgry => ({
	id: crypto.randomUUID(),
	name: `Ctgry ${ctgry}`,
	clues: [1, 2, 3, 4, 5].map(val => ({
		id: crypto.randomUUID(),
		text: `Clue ${ctgry}-${val}`,
		response: `Response ${ctgry}-${val}`,
		value: val * 100,
	})),
}));

const mockDBGame: Pick<GameWithEverything, 'id' | 'contestants'> = {
	id: gameId,
	contestants,
};

const scores: Record<string, number> = contestants.reduce(
	(scores, contestant) => {
		scores[contestant.sessionId] = Math.floor(Math.random() * 1000);
		return scores;
	},
	{} as Record<string, number>,
);

export default async function Pages__dev__games__play__display({ ctx }: RequestInfo): Promise<React.JSX.Element> {
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
	const mockSyncState: Pick<GamePhasePlayState, 'buzzerQueue' | 'scores' | 'selectedClue' | 'usedClueIds' | 'activeContestant'> =
		{
			buzzerQueue: [],
			scores,
			selectedClue: null,
			usedClueIds: [],
			activeContestant: randomlySelectedContestant,
		};

	try {
		return (
			<SetupLayout pageTitle="Dev Games Play Display" currentBasePage="dev" ctx={mockCtx}>
				<div className="view-display">
					<Scoreboard
						contestants={mockDBGame.contestants}
						scores={mockSyncState.scores}
						buzzerQueue={mockSyncState.buzzerQueue}
						activeContestant={mockSyncState.activeContestant}
					/>
					<ClueOverlay selectedClue={mockSyncState.selectedClue} />
					<Board categories={categories} usedClueIds={mockSyncState.usedClueIds} />
				</div>
			</SetupLayout>
		);
	} catch (err) {
		return caughtError(err, ctx.logger);
	}
}
