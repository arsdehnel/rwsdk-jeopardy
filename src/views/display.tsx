'use client';
import Board from '@/components/board';
import ClueOverlay from '@/components/clue-overlay';
import Scoreboard from '@/components/scoreboard';
import type { CategoryDBRead, Clue, Connections } from '@/types';

export default function DisplayView({
	connections,
	selectedClue,
	categories,
	usedClueIds,
	scores,
	buzzerQueue,
}: {
	connections: Connections;
	selectedClue: Clue | null;
	categories: CategoryDBRead[];
	usedClueIds: string[];
	scores: Record<string, number>;
	buzzerQueue: string[];
}): React.ReactNode {
	return (
		<div className="view-display">
			<Scoreboard connections={connections} scores={scores} buzzerQueue={buzzerQueue} />
			<ClueOverlay selectedClue={selectedClue} />
			<Board categories={categories} usedClueIds={usedClueIds} />
		</div>
	);
}
