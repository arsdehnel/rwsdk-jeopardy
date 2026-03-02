'use client';
import Board from '@/app/components/board';
import QuestionOverlay from '@/app/components/question-overlay';
import Scoreboard from '@/app/components/scoreboard';
import type getCategories from '@/categories';
import type { Clue, Connections } from '@/types';

export default function DisplayView({
	connections,
	selectedClue,
	clueState,
	categories,
}: {
	connections: Connections;
	selectedClue: Clue | null;
	clueState: string;
	categories: ReturnType<typeof getCategories>;
}) {
	return (
		<>
			<p>Role: Display</p>
			<Scoreboard connections={connections} />
			<QuestionOverlay selectedClue={selectedClue} clueState={clueState} />
			<Board categories={categories} />
		</>
	);
}
