'use client';
import type { Category } from '@/types';
import CategoryColumn from './category-column';

export default function Board({ categories, usedClueIds }: { categories: Category[]; usedClueIds: number[] }) {
	return (
		<div className="jeopardy-board">
			{categories.map(category => (
				<CategoryColumn key={category.id} category={category} usedClueIds={usedClueIds} />
			))}
		</div>
	);
}
