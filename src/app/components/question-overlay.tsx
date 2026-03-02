'use client';

import type { Clue } from '@/types';

const QuestionOverlay = ({ selectedQuestion, questionState }: { selectedQuestion: Clue | null; questionState: string }) => {
	if (questionState === 'initial' || !selectedQuestion) {
		return null;
	}

	return (
		<div className="jeopardy-question-overlay">
			<div className="jeopardy-question-content">
				{questionState === 'question' ? <p>{selectedQuestion.clue}</p> : <p>{selectedQuestion.response}</p>}
			</div>
		</div>
	);
};

export default QuestionOverlay;
