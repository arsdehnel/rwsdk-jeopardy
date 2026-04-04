'use client';
import type { RequestInfo } from 'rwsdk/worker';
import getCategories from '@/categories';
import type { Connections } from '@/types';
import HostView from '@/views/host';

export default function DevViewHost({ ctx }: RequestInfo) {
	const sessionId = ctx?.session.sessionId;
	if (!sessionId) {
		return <p>Session ID not found, please refresh the page.</p>;
	}

	const devClueSelected = true; // Set this to true or false to test both states
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

	let selectedClue = null;
	if (devClueSelected) {
		selectedClue = {
			id: 'clue1',
			value: 200,
			clue: 'This is a sample clue',
			response: 'What is a sample clue?',
		};
	}

	const buzzerQueue: string[] = [];

	return (
		<HostView
			connections={connections}
			buzzerQueue={buzzerQueue}
			abortClue={() => {}}
			correctClueResponse={() => {}}
			finishGame={() => {}}
			resetBuzzers={() => {}}
			setupGame={() => {}}
			wrongClueResponse={() => {}}
			expireClue={() => {}}
			selectedClue={selectedClue}
			scores={scores}
		/>
	);
}
