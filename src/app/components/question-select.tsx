'use client';

import type { Clue, TCategory } from '@/types';

export default function QuestionSelect({
	categories,
	selectClue,
}: {
	categories: TCategory[];
	selectClue: (question: Clue) => void;
}) {
	return (
		<div className="question-select">
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
