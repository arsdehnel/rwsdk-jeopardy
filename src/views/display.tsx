'use client';
import type getCategories from '@/categories';
import Board from '@/components/board';
import ClueOverlay from '@/components/clue-overlay';
import Scoreboard from '@/components/scoreboard';
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
