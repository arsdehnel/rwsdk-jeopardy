import { expect, test } from '@playwright/experimental-ct-react';
import type { CategoryInGame } from '@/types';
import { Board } from '../board';

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
	{
		id: 'cat-4',
		name: 'Geography',
		clues: [
			{ id: 'clue-4-1', text: 'The capital of Australia', response: 'What is Canberra?', value: 100 },
			{ id: 'clue-4-2', text: 'The longest river in the world', response: 'What is the Nile?', value: 200 },
			{ id: 'clue-4-3', text: 'The smallest country by area', response: 'What is Vatican City?', value: 300 },
			{ id: 'clue-4-4', text: 'The country with the most natural lakes', response: 'What is Canada?', value: 400 },
			{ id: 'clue-4-5', text: 'The deepest lake in the world', response: 'What is Lake Baikal?', value: 500 },
		],
	},
	{
		id: 'cat-5',
		name: 'Food & Drink',
		clues: [
			{ id: 'clue-5-1', text: 'The main ingredient in guacamole', response: 'What is avocado?', value: 100 },
			{ id: 'clue-5-2', text: 'The country that invented champagne', response: 'What is France?', value: 200 },
			{ id: 'clue-5-3', text: 'The spice that makes turmeric yellow', response: 'What is curcumin?', value: 300 },
			{ id: 'clue-5-4', text: 'The city famous for deep-dish pizza', response: 'What is Chicago?', value: 400 },
			{ id: 'clue-5-5', text: 'The Japanese art of rice wine brewing', response: 'What is sake?', value: 500 },
		],
	},
	{
		id: 'cat-6',
		name: 'Sports',
		clues: [
			{ id: 'clue-6-1', text: 'The number of players on a basketball team', response: 'What is 5?', value: 100 },
			{ id: 'clue-6-2', text: 'The Grand Slam tennis tournament held in Paris', response: 'What is Roland Garros?', value: 200 },
			{ id: 'clue-6-3', text: 'The distance of a marathon in miles', response: 'What is 26.2?', value: 300 },
			{ id: 'clue-6-4', text: 'The country that has won the most FIFA World Cups', response: 'What is Brazil?', value: 400 },
			{ id: 'clue-6-5', text: 'The Olympic motto in Latin', response: 'What is Citius, Altius, Fortius?', value: 500 },
		],
	},
];

test('board selection — several clues used across categories', async ({ mount }) => {
	const component = await mount(
		<Board
			categories={categories}
			usedClueIds={['clue-1-1', 'clue-1-3', 'clue-2-2', 'clue-2-5', 'clue-3-1', 'clue-4-4', 'clue-5-2', 'clue-6-3']}
		/>,
	);
	await expect(component).toHaveScreenshot();
});
