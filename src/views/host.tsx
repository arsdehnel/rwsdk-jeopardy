'use client';
import HostQuestionDisplay from '@/app/components/host-question-display';
import Scoreboard from '@/app/components/scoreboard';
import type { Connections } from '@/types';

export default function HostView({
	connections,
	questionState,
	setQuestionState,
	selectedQuestion,
	buzzedInPlayer,
	setBuzzedInPlayer,
	questionAnsweredCorrectly,
	setGameState,
}: {
	connections: Connections;
	questionState: string;
	setQuestionState: (questionState: string) => void;
	selectedQuestion: any;
	buzzedInPlayer: string | null;
	setBuzzedInPlayer: (player: string | null) => void;
	questionAnsweredCorrectly: (player: string | null, question: any) => void;
	setGameState: (gameState: string) => void;
}) {
	return (
		<>
			<p>Role: Host</p>
			<Scoreboard connections={connections} />
			<button type="button" onClick={() => setGameState('setup')}>
				Back to Setup
			</button>
			<button type="button" onClick={() => setGameState('end')}>
				End Game
			</button>
			{questionState === 'initial' ? (
				<p>Player choosing question...</p>
			) : (
				<HostQuestionDisplay
					selectedQuestion={selectedQuestion}
					setQuestionState={setQuestionState}
					buzzedInPlayer={buzzedInPlayer}
					setBuzzedInPlayer={setBuzzedInPlayer}
					questionAnsweredCorrectly={questionAnsweredCorrectly}
				/>
			)}
		</>
	);
}
