'use client';

export default function ClueValueTile({ value, used }: { value: number | undefined; used: boolean }) {
	return (
		<div className="jeopardy-clue">
			{used ? (
				<div className="jeopardy-clue-used" />
			) : (
				<button type="button" className="jeopardy-clue-button">
					{value}
				</button>
			)}
		</div>
	);
}
