'use client';
import type { CategoryInGame } from '@/types';
import CategoryColumn from './category-column';

export default function Board({
	categories,
	usedClueIds,
}: {
	categories: CategoryInGame[];
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
