'use client';
import classnames from 'classnames';
import Buzzer from '@/components/buzzer';
import ClueSelect from '@/components/clue-select';
import type { CategoryInGame, ClueInGame } from '@/types';

export default function ContestantView({
	selectClue,
	selectedClue,
	categories,
	buzzerQueue,
	sessionId,
	buzzIn,
	usedClueIds,
	activeContestant,
	buzzInTimeLeft,
}: {
	selectClue: (clue: ClueInGame) => void;
	selectedClue: ClueInGame | null;
	categories: CategoryInGame[];
	buzzerQueue: string[];
	sessionId: string;
	buzzIn: (contestantSessionId: string) => void;
	usedClueIds: string[];
	activeContestant: string | undefined;
	buzzInTimeLeft: number | undefined;
}): React.ReactNode {
	const mode = selectedClue ? 'buzzer' : 'clue-select';

	return (
		<div className={classnames('view-contestant', `view-contestant--${mode}`)}>
			{selectedClue === null ? (
				<ClueSelect
					selectClue={selectClue}
					categories={categories}
					usedClueIds={usedClueIds}
					activeContestant={activeContestant}
					sessionId={sessionId}
				/>
			) : (
				<Buzzer buzzIn={buzzIn} buzzerQueue={buzzerQueue} sessionId={sessionId} buzzInTimeLeft={buzzInTimeLeft} />
			)}
		</div>
	);
}
