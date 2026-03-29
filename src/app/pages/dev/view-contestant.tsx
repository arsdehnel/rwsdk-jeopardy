'use client';
import type { RequestInfo } from 'rwsdk/worker';
import ContestantView from '@/views/contestant';

export default function DevViewContestant({ ctx }: RequestInfo) {
	const sessionId = ctx?.session.sessionId;
	if (!sessionId) {
		return <p>Session ID not found, please refresh the page.</p>;
	}

	const devIsBuzzedIn = true; // Set this to true or false to test both states

	let buzzerQueue: string[] = [];
	if (devIsBuzzedIn) {
		buzzerQueue = [sessionId];
	}

	return (
		<ContestantView
			selectClue={() => {}}
			selectedClue={{
				id: 'clue1',
				value: 200,
				clue: 'This is a sample clue',
				response: 'What is a sample clue?',
			}}
			categories={[]}
			buzzerQueue={buzzerQueue}
			sessionId={sessionId}
			buzzIn={() => {}}
			usedClueIds={[]}
		/>
	);
}
