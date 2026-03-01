'use client';

export default function QuestionSelect({
	categories,
	selectQuestion,
}: {
	categories: any[];
	selectQuestion: (question: object) => void;
}) {
	return (
		<div className="question-select">
			{categories.map(category => {
				return (
					<>
						<h2>{category.title}</h2>
						<ul>
							{category.clues.map((clue: any) => {
								return (
									<li key={clue.id}>
										<button type="button" onClick={() => selectQuestion(clue)}>
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
