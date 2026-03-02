'use client';

import type { Clue } from '@/types';

const QuestionOverlay = ({ selectedClue, clueState }: { selectedClue: Clue | null; clueState: string }) => {
	if (clueState === 'initial' || !selectedClue) {
		return null;
	}

	return (
		<div className="jeopardy-question-overlay">
			<div className="jeopardy-question-content">
				{clueState === 'question' ? <p>{selectedClue.clue}</p> : <p>{selectedClue.response}</p>}
			</div>
		</div>
	);
};

export default QuestionOverlay;
