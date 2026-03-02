'use client';
import Buzzer from '@/app/components/buzzer';
import QuestionSelect from '@/app/components/question-select';
import type { Clue, TCategory } from '@/types';

export default function PlayerView({
	clueState,
	selectClue,
	categories,
	buzzedInPlayer,
	sessionId,
	setBuzzedInPlayer,
}: {
	clueState: string;
	selectClue: (clue: Clue) => void;
	categories: TCategory[];
	buzzedInPlayer: string | null;
	sessionId: string;
	setBuzzedInPlayer: (player: string | null) => void;
}) {
	return (
		<>
			<p>Role: Player</p>
			{clueState === 'initial' ? (
				<QuestionSelect selectClue={selectClue} categories={categories} />
			) : (
				<Buzzer setBuzzedInPlayer={setBuzzedInPlayer} buzzedInPlayer={buzzedInPlayer} sessionId={sessionId} />
			)}
		</>
	);
}
