'use client';
import type { CategoryDBRead } from '@/types';
import CategoryColumn from './category-column';

export default function Board({
	categories,
	usedClueIds,
}: {
	categories: CategoryDBRead[];
	usedClueIds: string[];
}): React.ReactNode {
	return (
		<div className="jeopardy-board">
			{categories.map(category => (
				<CategoryColumn key={category.id} category={category} usedClueIds={usedClueIds} />
			))}
		</div>
	);
}
