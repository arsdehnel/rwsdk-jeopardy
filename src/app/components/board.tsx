'use client';
import type { Category } from '@/types';
import CategoryColumn from './category-column';

export default function Board({ categories, usedClueIds }: { categories: Category[]; usedClueIds: string[] }) {
	return (
		<div className="jeopardy-board">
			{usedClueIds.join(',')}
			{categories.map(category => (
				<CategoryColumn key={category.id} category={category} usedClueIds={usedClueIds} />
			))}
		</div>
	);
}
