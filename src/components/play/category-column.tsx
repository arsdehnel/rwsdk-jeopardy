'use client';
import type { CategoryInGame } from '@/types';

export function CategoryColumn({ category, usedClueIds }: { category: CategoryInGame; usedClueIds: string[] }): React.ReactNode {
	return (
		<div className="jeopardy-category">
			<h2>{category.name}</h2>
			{category.clues.map(clue => {
				const used = usedClueIds.includes(clue.id);
				return (
					<div key={clue.id} className="jeopardy-clue">
						{used ? '' : clue.value}
					</div>
				);
			})}
		</div>
	);
}
