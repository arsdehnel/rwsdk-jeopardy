'use client';
import Buzzer from '@/app/components/buzzer';
import QuestionSelect from '@/app/components/question-select';

export default function PlayerView({
	questionState,
	selectQuestion,
	categories,
	buzzedInPlayer,
	sessionId,
	setBuzzedInPlayer,
}: {
	questionState: string;
	selectQuestion: (question: object) => void;
	categories: object[];
	buzzedInPlayer: string | null;
	sessionId: string;
	setBuzzedInPlayer: (player: string | null) => void;
}) {
	return (
		<>
			<p>Role: Player</p>
			{questionState === 'initial' ? (
				<QuestionSelect selectQuestion={selectQuestion} categories={categories} />
			) : (
				<Buzzer setBuzzedInPlayer={setBuzzedInPlayer} buzzedInPlayer={buzzedInPlayer} sessionId={sessionId} />
			)}
		</>
	);
}
