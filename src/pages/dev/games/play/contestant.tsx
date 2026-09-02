import type { RequestInfo } from 'rwsdk/worker';
import type { GamePhasePlayState } from '@/hooks/use-game-phase-play-state';
import { DefaultLayout } from '@/layouts';
import { createNoopLogger } from '@/logger';
import type { CategoryInGame } from '@/types';
import { caughtError } from '../../../utils';
import Pages__dev__games__play__contestant__client from './_contestant-client';

export default async function Pages__dev__games__play__contestant({ ctx }: RequestInfo): Promise<React.JSX.Element> {
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
		'buzzerQueue' | 'contestantMode' | 'selectedClue' | 'usedClueIds' | 'activeContestant' | 'buzzInTimerIsExpired'
	> = {
		buzzerQueue: [],
		contestantMode: 'buzzer',
		selectedClue: categories[1].clues[0],
		usedClueIds: [],
		activeContestant: randomlySelectedContestant,
		buzzInTimerIsExpired: false,
	};

	try {
		return (
			<DefaultLayout pageTitle="Dev Games Play Contestant" currentBasePage="dev" ctx={mockCtx}>
				<Pages__dev__games__play__contestant__client {...mockSyncState} categories={categories} />
			</DefaultLayout>
		);
	} catch (err) {
		return caughtError(err, ctx.logger);
	}
}
