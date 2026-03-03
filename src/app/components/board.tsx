'use client';
import type { Category } from '@/types';
import CategoryColumn from './category-column';

export default function Board({ categories }: { categories: Category[] }) {
	return (
		<div className="jeopardy-board">
			{categories.map(category => (
				<CategoryColumn key={category.id} category={category} />
			))}
		</div>
	);
}
