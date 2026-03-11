'use client';
import type { RequestInfo } from 'rwsdk/worker';
import getCategories from '@/categories';
import useGameState from '@/hooks/use-game-state';
import ContestantView from '@/views/contestant';
import DisplayView from '@/views/display';
import FinishedView from '@/views/finished';
import HostView from '@/views/host';
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
		usedClueIds,
		scores,
		correctClueResponse,
		wrongClueResponse,
		startGame,
		setupGame,
		finishGame,
		resetBuzzers,
		abortClue,
		selectClue,
		buzzIn,
		expireClue,
	} = useGameState(ctx?.session?.cookieId);

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
		return <FinishedView connections={connections} scores={scores} />;
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
			<DisplayView
				connections={connections}
				selectedClue={selectedClue}
				categories={categories}
				usedClueIds={usedClueIds}
				scores={scores}
			/>
		);
	}

	if (role === 'host') {
		return (
			<HostView
				connections={connections}
				selectedClue={selectedClue}
				abortClue={abortClue}
				buzzerQueue={buzzerQueue}
				scores={scores}
				resetBuzzers={resetBuzzers}
				correctClueResponse={correctClueResponse}
				wrongClueResponse={wrongClueResponse}
				setupGame={setupGame}
				finishGame={finishGame}
				expireClue={expireClue}
			/>
		);
	}

	return (
		<ContestantView
			selectedClue={selectedClue}
			selectClue={selectClue}
			categories={categories}
			buzzerQueue={buzzerQueue}
			sessionId={ctx.session?.cookieId || ''}
			buzzIn={buzzIn}
		/>
	);
}
