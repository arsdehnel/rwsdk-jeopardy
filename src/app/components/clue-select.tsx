'use client';

import type { Category, Clue } from '@/types';

export default function ClueSelect({ categories, selectClue }: { categories: Category[]; selectClue: (clue: Clue) => void }) {
	return (
		<div className="clue-select">
			{categories.map(category => {
				return (
					<>
						<h2>{category.title}</h2>
						<ul>
							{category.clues.map((clue: Clue) => {
								return (
									<li key={clue.id}>
										<button type="button" onClick={() => selectClue(clue)}>
											{clue.value}
										</button>
									</li>
								);
							})}
						</ul>
					</>
				);
			})}
		</div>
	);
}
