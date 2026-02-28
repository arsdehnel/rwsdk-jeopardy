'use client';

const QuestionOverlay = ({
	selectedQuestion,
	setQuestionState,
	questionState,
}: {
	selectedQuestion: any;
	setQuestionState: any;
	questionState: string;
}) => {
	if (questionState === 'initial' || !selectedQuestion) {
		return null;
	}

	const nextQuestionState = questionState === 'question' ? 'answer' : 'initial';

	return (
		<div className="jeopardy-question-overlay">
			<div className="jeopardy-question-content">
				{questionState === 'question' ? <p>{selectedQuestion.question}</p> : <p>{selectedQuestion.answer}</p>}
			</div>
			<button
				type="button"
				className="jeopardy-question-overlay-button"
				onClick={() => {
					setQuestionState(nextQuestionState);
				}}
			/>
		</div>
	);
};

export default QuestionOverlay;
