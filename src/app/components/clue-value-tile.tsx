'use client';

export default function ClueValueTile({ value, used }: { value: number | undefined; used: boolean }) {
	return <div className="jeopardy-clue">{used ? '' : value}</div>;
}
