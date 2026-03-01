'use client';
import Category from './category';

export default function Board({ categories, selectQuestion }: { categories: any[]; selectQuestion: (question: object) => void }) {
	return (
		<div className="jeopardy-board">
			{categories.map(category => (
				<Category key={category.id} category={category} selectQuestion={selectQuestion} />
			))}
		</div>
	);
}
