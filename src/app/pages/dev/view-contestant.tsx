'use client';
import type { RequestInfo } from 'rwsdk/worker';
import getCategories from '@/categories';
import ContestantView from '@/views/contestant';

export default function DevViewContestant({ ctx }: RequestInfo) {
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

	const devClueSelected = false; // Set this to true or false to test both states
	const devIsBuzzedIn = true; // Set this to true or false to test both states

	let selectedClue = null;
	if (devClueSelected) {
		selectedClue = {
			id: 'clue1',
			value: 200,
			clue: 'This is a sample clue',
			response: 'What is a sample clue?',
		};
	}

	let buzzerQueue: string[] = [];
	if (devIsBuzzedIn) {
		buzzerQueue = [sessionId];
	}

	return (
		<ContestantView
			selectClue={() => {}}
			selectedClue={selectedClue}
			categories={categories}
			buzzerQueue={buzzerQueue}
			sessionId={sessionId}
			buzzIn={() => {}}
			usedClueIds={usedClueIds}
		/>
	);
}
