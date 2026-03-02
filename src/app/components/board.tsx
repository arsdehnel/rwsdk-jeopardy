'use client';
import Category from './category';

export default function Board({ categories }: { categories: any[] }) {
	return (
		<div className="jeopardy-board">
			{categories.map(category => (
				<Category key={category.id} category={category} />
			))}
		</div>
	);
}
