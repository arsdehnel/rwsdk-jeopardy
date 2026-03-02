'use client';
import Board from '@/app/components/board';
import ClueOverlay from '@/app/components/clue-overlay';
import Scoreboard from '@/app/components/scoreboard';
import type getCategories from '@/categories';
import type { Clue, ClueState, Connections } from '@/types';

export default function DisplayView({
	connections,
	selectedClue,
	clueState,
	categories,
}: {
	connections: Connections;
	selectedClue: Clue | null;
	clueState: ClueState;
	categories: ReturnType<typeof getCategories>;
}) {
	return (
		<>
			<p>Role: Display</p>
			<Scoreboard connections={connections} />
			<ClueOverlay selectedClue={selectedClue} clueState={clueState} />
			<Board categories={categories} />
		</>
	);
}
