'use client';
import type { Clue } from '@/types';
import ClueValueTile from './clue-value-tile';

export default function CategoryColumn({
	category,
	usedClueIds,
}: {
	category: { title: string; clues: Clue[] };
	usedClueIds: number[];
}) {
	return (
		<div className="jeopardy-category">
			<h2>{category.title}</h2>
			{category.clues.map(clue => {
				return <ClueValueTile key={clue.id} value={clue.value} used={usedClueIds.includes(clue.id)} />;
			})}
		</div>
	);
}
