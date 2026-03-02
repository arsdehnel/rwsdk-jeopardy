'use client';

const QuestionOverlay = ({ selectedQuestion, questionState }: { selectedQuestion: any; questionState: string }) => {
	if (questionState === 'initial' || !selectedQuestion) {
		return null;
	}

	return (
		<div className="jeopardy-question-overlay">
			<div className="jeopardy-question-content">
				{questionState === 'question' ? <p>{selectedQuestion.question}</p> : <p>{selectedQuestion.answer}</p>}
			</div>
		</div>
	);
};

export default QuestionOverlay;
