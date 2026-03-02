'use client';
import Clue from './clue';

const Category = ({ category }: { category: { title: string; clues: any[] } }) => {
	return (
		<div className="jeopardy-category">
			<h2>{category.title}</h2>
			{category.clues.map(clue => {
				return <Clue key={clue.id} value={clue.value} {...clue} />;
			})}
		</div>
	);
};

export default Category;
