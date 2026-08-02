'use client';
import type { CategoryInGame } from '@/types';
import ClueValueTile from './clue-value-tile';

export default function CategoryColumn({
	category,
	usedClueIds,
}: {
	category: CategoryInGame;
	usedClueIds: string[];
}): React.ReactNode {
	return (
		<div className="jeopardy-category">
			<h2>{category.name}</h2>
			{category.clues.map(clue => {
				return <ClueValueTile key={clue.id} value={clue.value} used={usedClueIds.includes(clue.id)} />;
			})}
		</div>
	);
}
