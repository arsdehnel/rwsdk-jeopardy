'use client';
import Clue from './clue';

const Category = ({
	category,
	selectQuestion,
}: {
	category: { title: string; clues: any[] };
	selectQuestion: (question: object) => void;
}) => {
	return (
		<div className="jeopardy-category">
			<h2>{category.title}</h2>
			{category.clues.map(clue => {
				return <Clue key={clue.id} value={clue.value} selectQuestion={selectQuestion} {...clue} />;
			})}
		</div>
	);
};

export default Category;
