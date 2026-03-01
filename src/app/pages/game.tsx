'use client';
import { useSyncedState } from 'rwsdk/use-synced-state/client';
import type { RequestInfo } from 'rwsdk/worker';

import Board from '@/app/components/board';
import MemberSelect from '@/app/components/member-select';
import QuestionOverlay from '@/app/components/question-overlay';
import getCategories from '@/categories';

export type Connection = {
	id: string;
	name: string;
	role: 'host' | 'player' | 'display';
};

export type Connections = {
	host: Connection | undefined;
	scoreboard: Connection | undefined;
	members: Connection[];
};

export default function Game({ params, ctx }: RequestInfo) {
	const [selectedQuestion, setSelectedQuestion] = useSyncedState({}, 'selectedQuestion');
	const [questionState, setQuestionState] = useSyncedState('initial', 'questionState');
	const [gameState, setGameState] = useSyncedState('setup', 'gameState');
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

	if (gameState === 'setup') {
		return (
			<>
				<h1>Game Setup</h1>
				<p>Waiting for players to join...</p>
				{ctx.session?.cookieId && <p>Your session ID: {ctx.session.cookieId}</p>}
				{ctx.session?.cookieId && (
					<MemberSelect
						connections={connections}
						registerConnection={registerConnection}
						unregisterConnection={unregisterConnection}
						sessionId={ctx.session?.cookieId}
					/>
				)}
				<button type="button" onClick={() => setGameState('active')}>
					Start Game
				</button>
			</>
		);
	}

	const categories = getCategories();
	return (
		<>
			<QuestionOverlay selectedQuestion={selectedQuestion} setQuestionState={setQuestionState} questionState={questionState} />
			<Board categories={categories} selectQuestion={selectQuestion} />
		</>
	);
}
