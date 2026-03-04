'use client';
import type { RequestInfo } from 'rwsdk/worker';
import getCategories from '@/categories';
import useGameState from '@/hooks/use-game-state';
import DisplayView from '@/views/display';
import FinishedView from '@/views/finished';
import HostView from '@/views/host';
import PlayerView from '@/views/player';
import SetupView from '@/views/setup';

export default function Game({ params, ctx }: RequestInfo) {
	const {
		connections,
		registerConnection,
		unregisterConnection,
		role,
		selectedClue,
		gamePhase,
		buzzerQueue,
		correctClueResponse,
		wrongClueResponse,
		startGame,
		setupGame,
		finishGame,
		resetBuzzers,
		abortClue,
		selectClue,
		buzzIn,
	} = useGameState();

	const gameId = params.gameId;
	if (!gameId) {
		return <p>Game ID not provided</p>;
	}

	if (gamePhase === 'setup') {
		return (
			<SetupView
				connections={connections}
				registerConnection={registerConnection}
				unregisterConnection={unregisterConnection}
				sessionId={ctx.session?.cookieId || ''}
				role={role}
				startGame={startGame}
			/>
		);
	}

	if (gamePhase === 'finished') {
		return <FinishedView connections={connections} />;
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
		return <DisplayView connections={connections} selectedClue={selectedClue} categories={categories} />;
	}

	if (role === 'host') {
		return (
			<HostView
				connections={connections}
				selectedClue={selectedClue}
				abortClue={abortClue}
				buzzerQueue={buzzerQueue}
				resetBuzzers={resetBuzzers}
				correctClueResponse={correctClueResponse}
				wrongClueResponse={wrongClueResponse}
				setupGame={setupGame}
				finishGame={finishGame}
			/>
		);
	}

	return (
		<PlayerView
			selectedClue={selectedClue}
			selectClue={selectClue}
			categories={categories}
			buzzerQueue={buzzerQueue}
			sessionId={ctx.session?.cookieId || ''}
			buzzIn={buzzIn}
		/>
	);
}
