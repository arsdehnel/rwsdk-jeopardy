import { expect, test } from '@playwright/experimental-ct-react';
import type { ClueInGame, GameContestantDBRead } from '@/types';
import HostShell from '../__shells__/_host-shell';

const contestants: GameContestantDBRead[] = [
	{
		id: 'c1',
		gameId: 'g1',
		sessionId: 'session-1',
		userId: null,
		name: 'Alice',
		score: 200,
		createdAt: '2026-01-01',
		createdBy: 'system',
		updatedAt: null,
		updatedBy: null,
		deletedAt: null,
		deletedBy: null,
	},
	{
		id: 'c2',
		gameId: 'g1',
		sessionId: 'session-2',
		userId: null,
		name: 'Bob',
		score: 0,
		createdAt: '2026-01-01',
		createdBy: 'system',
		updatedAt: null,
		updatedBy: null,
		deletedAt: null,
		deletedBy: null,
	},
	{
		id: 'c3',
		gameId: 'g1',
		sessionId: 'session-3',
		userId: null,
		name: 'Carol',
		score: -100,
		createdAt: '2026-01-01',
		createdBy: 'system',
		updatedAt: null,
		updatedBy: null,
		deletedAt: null,
		deletedBy: null,
	},
];

const scores: Record<string, number> = {
	'session-1': 200,
	'session-2': 0,
	'session-3': -100,
};

const selectedClue: ClueInGame = {
	id: 'clue-1-2',
	text: 'The chemical symbol for gold',
	response: 'What is Au?',
	value: 200,
};

test('host view — contestant is making a selection', async ({ mount }) => {
	const component = await mount(
		<HostShell
			contestants={contestants}
			scores={scores}
			selectedClue={null}
			buzzerQueue={[]}
			activeContestant={contestants[0]}
		/>,
	);
	await expect(component).toHaveScreenshot();
});

test('host view — contestant has buzzed in and is answering', async ({ mount }) => {
	const component = await mount(
		<HostShell
			contestants={contestants}
			scores={scores}
			selectedClue={selectedClue}
			buzzerQueue={['session-1']}
			activeContestant={contestants[0]}
			responseTimerIsActive={true}
			responseTimeLeft={3}
		/>,
	);
	await expect(component).toHaveScreenshot();
});
