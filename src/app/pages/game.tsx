'use client';
import { useSyncedState } from 'rwsdk/use-synced-state/client';
import type { RequestInfo } from 'rwsdk/worker';

import Board from '@/app/components/board';
import QuestionOverlay from '@/app/components/question-overlay';
import getCategories from '@/categories';
import type { Connection, Connections } from '@/types';
import getRoleFromConnections from '@/utils/get-role-from-connections';
import SetupView from '@/views/setup';
import Buzzer from '../components/buzzer';
import HostQuestionDisplay from '../components/host-question-display';
import QuestionSelect from '../components/question-select';
import Scoreboard from '../components/scoreboard';

export default function Game({ params, ctx }: RequestInfo) {
	const [selectedQuestion, setSelectedQuestion] = useSyncedState({}, 'selectedQuestion');
	const [questionState, setQuestionState] = useSyncedState('initial', 'questionState');
	const [gameState, setGameState] = useSyncedState('setup', 'gameState');
	const [buzzedInPlayer, setBuzzedInPlayer] = useSyncedState<string | null>(null, 'buzzedInPlayer');
	const [connections, setConnections] = useSyncedState<Connections>(
		{ host: undefined, scoreboard: undefined, members: [] },
		'connections',
	);

	const gameId = params.gameId;
	if (!gameId) {
		return <p>Game ID not provided</p>;
	}

	const registerConnection = (connection: Connection) => {
		if (connection.role === 'host') {
			setConnections({ ...connections, host: connection });
		} else if (connection.role === 'display') {
			setConnections({ ...connections, scoreboard: connection });
		} else {
			setConnections({ ...connections, members: [...connections.members, connection] });
		}
	};

	const unregisterConnection = (connectionId: string) => {
		if (connections.host?.id === connectionId) {
			setConnections({ ...connections, host: undefined });
		} else if (connections.scoreboard?.id === connectionId) {
			setConnections({ ...connections, scoreboard: undefined });
		} else {
			setConnections({ ...connections, members: connections.members.filter(member => member.id !== connectionId) });
		}
	};

	const selectQuestion = (question: object) => {
		setSelectedQuestion(question);
		setQuestionState('question');
	};

	const questionAnsweredCorrectly = (player: string | null, question: any) => {
		// In a real app, this would update the player's score in the database
		setBuzzedInPlayer(null);
		setQuestionState('initial');
	};

	const role = getRoleFromConnections(connections, ctx.session?.cookieId || '');
	if (gameState === 'setup') {
		return (
			<SetupView
				connections={connections}
				registerConnection={registerConnection}
				unregisterConnection={unregisterConnection}
				sessionId={ctx.session?.cookieId || ''}
				role={role || ''}
				setGameState={setGameState}
			/>
		);
	}

	if (gameState === 'end') {
		return (
			<>
				<h1>Game Over</h1>
				<Scoreboard connections={connections} />
			</>
		);
	}

	if (!role) {
		return (
			<p>
				You are not registered in this game but the game has started, please contact the host and have them revert it back to
				setup stage.
			</p>
		);
	}

	const categories = getCategories();

	// game mode active
	if (role === 'display') {
		return (
			<>
				<p>Role: Display</p>
				<Scoreboard connections={connections} />
				<QuestionOverlay selectedQuestion={selectedQuestion} questionState={questionState} />
				<Board categories={categories} />
			</>
		);
	}

	if (role === 'host') {
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

	return (
		<>
			<p>Role: Player</p>
			{questionState === 'initial' ? (
				<QuestionSelect selectQuestion={selectQuestion} categories={categories} />
			) : (
				<Buzzer setBuzzedInPlayer={setBuzzedInPlayer} buzzedInPlayer={buzzedInPlayer} sessionId={ctx.session?.cookieId} />
			)}
		</>
	);
}
