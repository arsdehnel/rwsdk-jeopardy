'use client';

export default function ClueValueTile({ value, used }: { value: number | undefined; used: boolean }) {
	return (
		<div className="jeopardy-clue">
			<button type="button" className="jeopardy-clue-button" disabled={used}>
				{value}
			</button>
		</div>
	);
}
