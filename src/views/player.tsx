'use client';
import Buzzer from '@/app/components/buzzer';
import ClueSelect from '@/app/components/clue-select';
import type { Category, Clue } from '@/types';

export default function PlayerView({
	selectClue,
	selectedClue,
	categories,
	buzzerQueue,
	sessionId,
	buzzIn,
}: {
	selectClue: (clue: Clue) => void;
	selectedClue: Clue | null;
	categories: Category[];
	buzzerQueue: string[];
	sessionId: string;
	buzzIn: (playerSessionId: string) => void;
}) {
	return (
		<>
			<p>Role: Player</p>
			{selectedClue === null ? (
				<ClueSelect selectClue={selectClue} categories={categories} />
			) : (
				<Buzzer buzzIn={buzzIn} buzzerQueue={buzzerQueue} sessionId={sessionId} />
			)}
		</>
	);
}
