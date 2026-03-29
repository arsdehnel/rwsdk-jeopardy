import { expect, test } from '@playwright/experimental-ct-react';
import getCategories from '@/categories';
import type { Category, Clue } from '../../../src/types';
import ContestantView from '../../../src/views/contestant';

const mockCategories: Category[] = getCategories();

const mockClue: Clue = {
	id: 'clue-1',
	value: 200,
	clue: 'This is a sample clue?',
	response: 'What is a sample answer?',
};

test('clue select mode', async ({ mount }) => {
	const component = await mount(
		<ContestantView
			selectedClue={null}
			categories={mockCategories}
			selectClue={() => {}}
			buzzerQueue={[]}
			sessionId="test-session"
			buzzIn={() => {}}
			usedClueIds={[]}
		/>,
	);
	await expect(component).toHaveScreenshot();
});

test('Buzzer mode with empty queue', async ({ mount }) => {
	const component = await mount(
		<ContestantView
			selectedClue={mockClue}
			categories={mockCategories}
			selectClue={() => {}}
			buzzerQueue={[]}
			sessionId="test-session"
			buzzIn={() => {}}
			usedClueIds={[]}
		/>,
	);
	await expect(component).toHaveScreenshot();
});

test('Buzzer mode with another contestant in the queue', async ({ mount }) => {
	const component = await mount(
		<ContestantView
			selectedClue={mockClue}
			categories={mockCategories}
			selectClue={() => {}}
			buzzerQueue={['foo']}
			sessionId="test-session"
			buzzIn={() => {}}
			usedClueIds={[]}
		/>,
	);
	await expect(component).toHaveScreenshot();
});

test('Buzzer mode with current contestant at the front of the queue', async ({ mount }) => {
	const component = await mount(
		<ContestantView
			selectedClue={mockClue}
			categories={mockCategories}
			selectClue={() => {}}
			buzzerQueue={['test-session']}
			sessionId="test-session"
			buzzIn={() => {}}
			usedClueIds={[]}
		/>,
	);
	await expect(component).toHaveScreenshot();
});

test('Buzzer mode with current contestant in position 2 of the queue', async ({ mount }) => {
	const component = await mount(
		<ContestantView
			selectedClue={mockClue}
			categories={mockCategories}
			selectClue={() => {}}
			buzzerQueue={['foo', 'test-session']}
			sessionId="test-session"
			buzzIn={() => {}}
			usedClueIds={[]}
		/>,
	);
	await expect(component).toHaveScreenshot();
});
