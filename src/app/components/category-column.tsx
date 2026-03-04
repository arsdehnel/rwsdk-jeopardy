'use client';
import type { Clue } from '@/types';
import ClueValueTile from './clue-value-tile';

export default function CategoryColumn({ category }: { category: { title: string; clues: Clue[] } }) {
	return (
		<div className="jeopardy-category">
			<h2>{category.title}</h2>
			{category.clues.map(clue => {
				return <ClueValueTile key={clue.id} value={clue.value} />;
			})}
		</div>
	);
}
