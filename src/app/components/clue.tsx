'use client';

const Clue = ({
	id,
	value,
	question,
	answer,
	selectQuestion,
}: {
	id: number;
	value: number;
	question: string;
	answer: string;
	selectQuestion: (state: object) => void;
}) => {
	return (
		<div className="jeopardy-clue">
			<button type="button" className="jeopardy-clue-button" onClick={e => selectQuestion({ id, question, answer })}>
				{value}
			</button>
		</div>
	);
};

export default Clue;
