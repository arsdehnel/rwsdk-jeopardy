import { expect, test } from '@playwright/experimental-ct-react';
import type { CategoryInGame, ClueInGame, GameContestantDBRead } from '@/types';
import ContestantShell from '../__shells__/_contestant-shell';

const activeContestant: GameContestantDBRead = {
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
};

const categories: CategoryInGame[] = [
	{
		id: 'cat-1',
		name: 'Science',
		clues: [
			{ id: 'clue-1-1', text: 'The boiling point of water', response: 'What is 100°C?', value: 100 },
			{ id: 'clue-1-2', text: 'The chemical symbol for gold', response: 'What is Au?', value: 200 },
			{ id: 'clue-1-3', text: 'The speed of light', response: 'What is 299,792,458 m/s?', value: 300 },
			{ id: 'clue-1-4', text: 'The powerhouse of the cell', response: 'What is the mitochondria?', value: 400 },
			{ id: 'clue-1-5', text: 'The number of bones in the human body', response: 'What is 206?', value: 500 },
		],
	},
	{
		id: 'cat-2',
		name: 'History',
		clues: [
			{ id: 'clue-2-1', text: 'Year World War II ended', response: 'What is 1945?', value: 100 },
			{ id: 'clue-2-2', text: 'First US President', response: 'Who is George Washington?', value: 200 },
			{ id: 'clue-2-3', text: 'Year the Berlin Wall fell', response: 'What is 1989?', value: 300 },
			{ id: 'clue-2-4', text: 'Ancient wonder: Great Pyramid location', response: 'What is Giza?', value: 400 },
			{ id: 'clue-2-5', text: 'Year Columbus reached the Americas', response: 'What is 1492?', value: 500 },
		],
	},
	{
		id: 'cat-3',
		name: 'Pop Culture',
		clues: [
			{ id: 'clue-3-1', text: 'The Wizard of Oz destination', response: 'What is Oz?', value: 100 },
			{ id: 'clue-3-2', text: 'Home of the Simpsons', response: 'What is Springfield?', value: 200 },
			{ id: 'clue-3-3', text: "Bond's famous drink order", response: 'What is martini, shaken not stirred?', value: 300 },
			{ id: 'clue-3-4', text: 'The Jedi weapon', response: 'What is a lightsaber?', value: 400 },
			{ id: 'clue-3-5', text: 'HAL 9000 film', response: 'What is 2001: A Space Odyssey?', value: 500 },
		],
	},
];

const selectedClue: ClueInGame = {
	id: 'clue-1-2',
	text: 'The chemical symbol for gold',
	response: 'What is Au?',
	value: 200,
};

test('contestant view — active contestant making a selection', async ({ mount }) => {
	const component = await mount(
		<ContestantShell
			contestantMode="clue-select"
			selectedClue={null}
			categories={categories}
			usedClueIds={['clue-1-1', 'clue-2-3', 'clue-3-2']}
			buzzInTimerIsExpired={false}
			buzzerQueue={[]}
			sessionId="session-1"
			activeContestant={activeContestant}
		/>,
	);
	await expect(component).toHaveScreenshot();
});

test('contestant view — clue selected, buzzer ready', async ({ mount }) => {
	const component = await mount(
		<ContestantShell
			contestantMode="buzzer"
			selectedClue={selectedClue}
			categories={categories}
			usedClueIds={['clue-1-1', 'clue-2-3', 'clue-3-2']}
			buzzInTimerIsExpired={false}
			buzzerQueue={[]}
			sessionId="session-1"
			activeContestant={activeContestant}
		/>,
	);
	await expect(component).toHaveScreenshot();
});
