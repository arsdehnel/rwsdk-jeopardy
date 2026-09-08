'use client';
import { Buzzer, ClueSelect } from '@/components/play';
import type { CategoryInGame, ClueInGame, GameContestantDBRead } from '@/types';

export default function ContestantShell({
	contestantMode,
	selectedClue,
	categories,
	usedClueIds,
	buzzInTimerIsExpired,
	buzzerQueue,
	sessionId,
	activeContestant,
}: {
	contestantMode: 'clue-select' | 'buzzer' | 'answered-wrong';
	selectedClue: ClueInGame | null;
	categories: CategoryInGame[];
	usedClueIds: string[];
	buzzInTimerIsExpired: boolean;
	buzzerQueue: string[];
	sessionId: string;
	activeContestant: GameContestantDBRead | undefined;
}): React.ReactNode {
	return (
		<div className="view-contestant">
			{contestantMode === 'clue-select' && (
				<ClueSelect
					selectClue={(): void => {}}
					selectedClue={selectedClue}
					categories={categories}
					usedClueIds={usedClueIds}
					activeContestant={activeContestant}
					sessionId={sessionId}
				/>
			)}
			{contestantMode === 'buzzer' && (
				<Buzzer
					selectedClue={selectedClue}
					buzzInTimerIsExpired={buzzInTimerIsExpired}
					buzzIn={(): void => {}}
					buzzerQueue={buzzerQueue}
					sessionId={sessionId}
				/>
			)}
			{contestantMode === 'answered-wrong' && <p>You answered incorrectly, waiting for this clue to be completed</p>}
		</div>
	);
}
