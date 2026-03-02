'use client';
import Buzzer from '@/app/components/buzzer';
import QuestionSelect from '@/app/components/question-select';
import type { Clue, TCategory } from '@/types';

export default function PlayerView({
	questionState,
	selectClue,
	categories,
	buzzedInPlayer,
	sessionId,
	setBuzzedInPlayer,
}: {
	questionState: string;
	selectClue: (clue: Clue) => void;
	categories: TCategory[];
	buzzedInPlayer: string | null;
	sessionId: string;
	setBuzzedInPlayer: (player: string | null) => void;
}) {
	return (
		<>
			<p>Role: Player</p>
			{questionState === 'initial' ? (
				<QuestionSelect selectClue={selectClue} categories={categories} />
			) : (
				<Buzzer setBuzzedInPlayer={setBuzzedInPlayer} buzzedInPlayer={buzzedInPlayer} sessionId={sessionId} />
			)}
		</>
	);
}
