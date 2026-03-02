'use client';

export default function ClueValueTile({ value }: { value: number | undefined }) {
	return (
		<div className="jeopardy-clue">
			<button type="button" className="jeopardy-clue-button">
				{value}
			</button>
		</div>
	);
}
