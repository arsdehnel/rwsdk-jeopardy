'use client';
import { useState } from 'react';
import type { RequestInfo } from 'rwsdk/worker';
import getCategories from '@/categories';
import ContestantView from '@/views/contestant';

export default function DevViewContestant({ ctx }: RequestInfo) {
	const sessionId = ctx?.session.sessionId;

	const devClueSelected = false; // Set this to true or false to test both states
	const devIsBuzzedIn = false; // Set this to true or false to test both states
	const othersBuzzedIn = true; // Set this to true or false to test both states

	let defaultBuzzerQueue: string[] = [];
	if (devIsBuzzedIn && sessionId) {
		defaultBuzzerQueue.push(sessionId);
	} else if (othersBuzzedIn) {
		defaultBuzzerQueue = ['otherSession1', 'otherSession2'];
	}

	const [buzzerQueue, setBuzzerQueue] = useState<string[]>(defaultBuzzerQueue);

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

	let selectedClue = null;
	if (devClueSelected) {
		selectedClue = {
			id: 'clue1',
			value: 200,
			clue: 'This is a sample clue',
			response: 'What is a sample clue?',
		};
	}

	const buzzIn = () => {
		setBuzzerQueue(prev => [...prev, sessionId]);
	};

	return (
		<ContestantView
			selectClue={() => {}}
			selectedClue={selectedClue}
			categories={categories}
			buzzerQueue={buzzerQueue}
			sessionId={sessionId}
			buzzIn={buzzIn}
			usedClueIds={usedClueIds}
		/>
	);
}
