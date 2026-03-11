import Board from '@/app/components/board';

export default function UsedClueStyling() {
	const usedClueIds = ['1AG4'];

	const categories = [
		{
			id: '1',
			title: 'Test Category',
			clues: [
				{
					id: '1AG4',
					clue: 'Test Clue 1',
					response: 'Test Response 1',
					value: 100,
				},
				{
					id: '1BG5',
					clue: 'Test Clue 2',
					response: 'Test Response 2',
					value: 200,
				},
				{
					id: '1BG9',
					clue: 'Test Clue 3',
					response: 'Test Response 3',
					value: 300,
				},
				{
					id: '1CG5',
					clue: 'Test Clue 4',
					response: 'Test Response 4',
					value: 400,
				},
				{
					id: '2BG5',
					clue: 'Test Clue 5',
					response: 'Test Response 5',
					value: 500,
				},
			],
		},
	];

	return <Board categories={categories} usedClueIds={usedClueIds} />;
}
