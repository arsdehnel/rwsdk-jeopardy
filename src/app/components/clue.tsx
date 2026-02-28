'use client';
import { useState } from 'react';

const Clue = ({ value, question, answer }: { value: number; question: string; answer: string }) => {
	const [stage, setStage] = useState('INITIAL');

	const handleClick = () => {
		if (stage === 'INITIAL') {
			setStage('ANSWER');
		} else if (stage === 'ANSWER') {
			setStage('QUESTION');
		} else {
			setStage('INITIAL');
		}
	};

	let content: string | React.ReactNode;
	if (stage === 'INITIAL') {
		content = `$${value}`;
	} else if (stage === 'ANSWER') {
		content = <p className="jeopardy-clue-container">{question || null}</p>;
	} else if (stage === 'QUESTION') {
		content = <p>{answer || null}</p>;
	}

	return (
		<div className="jeopardy-clue">
			<button type="button" className="jeopardy-clue-button" onClick={handleClick}>
				{content}
			</button>
		</div>
	);
};

export default Clue;
