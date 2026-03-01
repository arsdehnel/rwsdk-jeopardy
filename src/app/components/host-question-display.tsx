'use client';

export default function HostQuestionDisplay({
	selectedQuestion,
	setQuestionState,
	buzzedInPlayer,
	setBuzzedInPlayer,
	questionAnsweredCorrectly,
}: {
	selectedQuestion: any;
	setQuestionState: any;
	buzzedInPlayer: string | null;
	setBuzzedInPlayer: (player: string | null) => void;
	questionAnsweredCorrectly: (player: string | null, question: any) => void;
}) {
	return (
		<div>
			<h2>Question</h2>
			<p>{selectedQuestion.question}</p>
			<h2>Answer</h2>
			<p>{selectedQuestion.answer}</p>
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
