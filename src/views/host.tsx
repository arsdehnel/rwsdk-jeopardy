'use client';
import HostQuestionDisplay from '@/app/components/host-question-display';
import Scoreboard from '@/app/components/scoreboard';
import type { Clue, Connections } from '@/types';

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
	selectedQuestion: Clue | null;
	buzzedInPlayer: string | null;
	setBuzzedInPlayer: (player: string | null) => void;
	questionAnsweredCorrectly: (player: string | null, question: Clue) => void;
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
				selectedQuestion && (
					<HostQuestionDisplay
						selectedQuestion={selectedQuestion}
						setQuestionState={setQuestionState}
						buzzedInPlayer={buzzedInPlayer}
						setBuzzedInPlayer={setBuzzedInPlayer}
						questionAnsweredCorrectly={questionAnsweredCorrectly}
					/>
				)
			)}
		</>
	);
}
