'use client';

export default function ClueValueTile({ value, used }: { value: number | undefined; used: boolean }): React.ReactNode {
	return <div className="jeopardy-clue">{used ? '' : value}</div>;
}
