'use client';
import { Buzzer, ClueSelect } from '@/components/play';
import type { GamePhasePlayState } from '@/hooks/use-game-phase-play-state';
import type { CategoryInGame } from '@/types';

export default function Pages__dev__games__play__contestant__client({
	contestantMode,
	selectedClue,
	categories,
	usedClueIds,
	buzzInTimerIsExpired,
	buzzerQueue,
}: Pick<
	GamePhasePlayState,
	'buzzerQueue' | 'contestantMode' | 'selectedClue' | 'usedClueIds' | 'activeContestant' | 'buzzInTimerIsExpired'
> & {
	categories: CategoryInGame[];
}): React.ReactNode {
	const selectClue = (): void => {};
	const buzzIn = (): void => {};

	return (
		<div className="view-contestant">
			{contestantMode === 'clue-select' && (
				<ClueSelect
					selectClue={selectClue}
					selectedClue={selectedClue}
					categories={categories}
					usedClueIds={usedClueIds}
					activeContestant={undefined}
					sessionId="foo"
				/>
			)}
			{contestantMode === 'buzzer' && (
				<Buzzer
					selectedClue={selectedClue}
					buzzInTimerIsExpired={buzzInTimerIsExpired}
					buzzIn={(): void => buzzIn()}
					buzzerQueue={buzzerQueue}
					sessionId="foo"
				/>
			)}
			{contestantMode === 'answered-wrong' && <p>You answered incorrectly, waiting for this clue to be completed</p>}
		</div>
	);
}
