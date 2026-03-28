'use client';
import type { RequestInfo } from 'rwsdk/worker';
import getCategories from '@/categories';
import type { Connections } from '@/types';
import DisplayView from '@/views/display';

export default function DevViewDisplay({ ctx }: RequestInfo) {
	const sessionId = ctx?.session.sessionId;
	if (!sessionId) {
		return <p>Session ID not found, please refresh the page.</p>;
	}

	const categories = getCategories();
	const usedClueIds: string[] = [];
	categories.forEach(cat => {
		cat.clues.forEach(clue => {
			if (Math.random() > 0.5) {
				usedClueIds.push(clue.id);
			}
		});
	});

	const scores = {
		contestant1: 1000,
		contestant2: 2000,
		contestant3: 3000,
	};

	const connections: Connections = {
		host: { id: 'host1', name: 'Host 1', role: 'host' },
		display: { id: 'display1', name: 'Display 1', role: 'display' },
		contestants: [
			{
				id: 'contestant1',
				name: 'Contestant 1',
				role: 'contestant',
			},
			{
				id: 'contestant2',
				name: 'Contestant 2',
				role: 'contestant',
			},
			{
				id: 'contestant3',
				name: 'Contestant 3',
				role: 'contestant',
			},
		],
	};

	return (
		<DisplayView
			connections={connections}
			categories={categories}
			selectedClue={null}
			usedClueIds={usedClueIds}
			scores={scores}
		/>
	);
}
