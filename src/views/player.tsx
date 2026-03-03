'use client';
import Buzzer from '@/app/components/buzzer';
import ClueSelect from '@/app/components/clue-select';
import type { Clue, TCategory } from '@/types';

export default function PlayerView({
	setSelectedClue,
	selectedClue,
	categories,
	buzzedInPlayer,
	sessionId,
	setBuzzedInPlayer,
}: {
	setSelectedClue: (clue: Clue) => void;
	selectedClue: Clue | null;
	categories: TCategory[];
	buzzedInPlayer: string | null;
	sessionId: string;
	setBuzzedInPlayer: (player: string | null) => void;
}) {
	return (
		<>
			<p>Role: Player</p>
			{selectedClue === null ? (
				<ClueSelect setSelectedClue={setSelectedClue} categories={categories} />
			) : (
				<Buzzer setBuzzedInPlayer={setBuzzedInPlayer} buzzedInPlayer={buzzedInPlayer} sessionId={sessionId} />
			)}
		</>
	);
}
