'use client';
import Board from '@/app/components/board';
import ClueOverlay from '@/app/components/clue-overlay';
import Scoreboard from '@/app/components/scoreboard';
import type getCategories from '@/categories';
import type { Clue, Connections } from '@/types';

export default function DisplayView({
	connections,
	selectedClue,
	categories,
	usedClueIds,
	scores,
}: {
	connections: Connections;
	selectedClue: Clue | null;
	categories: ReturnType<typeof getCategories>;
	usedClueIds: string[];
	scores: Record<string, number>;
}) {
	return (
		<div className="view-display">
			<Scoreboard connections={connections} scores={scores} />
			<ClueOverlay selectedClue={selectedClue} />
			<Board categories={categories} usedClueIds={usedClueIds} />
		</div>
	);
}
