'use client';

import type { Clue } from '@/types';

export default function HostQuestionDisplay({
	selectedQuestion,
	setQuestionState,
	buzzedInPlayer,
	setBuzzedInPlayer,
	questionAnsweredCorrectly,
}: {
	selectedQuestion: Clue;
	setQuestionState: (questionState: string) => void;
	buzzedInPlayer: string | null;
	setBuzzedInPlayer: (player: string | null) => void;
	questionAnsweredCorrectly: (player: string | null, clue: Clue) => void;
}) {
	return (
		<div>
			<h2>Question</h2>
			<p>{selectedQuestion.clue}</p>
			<h2>Answer</h2>
			<p>{selectedQuestion.response}</p>
			<button
				type="button"
				className="jeopardy-question-overlay-button"
				onClick={() => {
					setQuestionState('initial');
				}}
			>
				Back to Board
			</button>
			{buzzedInPlayer ? <p>{buzzedInPlayer} has buzzed in!</p> : <p>No one has buzzed in yet.</p>}
			<button type="submit" onClick={() => setBuzzedInPlayer(null)}>
				Answer was wrong, reset buzzers
			</button>
			<button type="submit" onClick={() => questionAnsweredCorrectly(buzzedInPlayer, selectedQuestion)}>
				Answer was correct, award points and reset buzzers
			</button>
		</div>
	);
}
