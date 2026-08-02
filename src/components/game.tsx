'use client';
import useGameState from '@/hooks/use-game-state';
import type { CategoryInGame } from '@/types';
import ContestantView from '@/views/contestant';
import DisplayView from '@/views/display';
import FinishedView from '@/views/finished';
import HostView from '@/views/host';
import SetupView from '@/views/setup';

export default function GameClient({
	gameUrl,
	sessionId,
	categories,
}: {
	gameUrl: string;
	sessionId: string;
	categories: CategoryInGame[]; // Replace 'any[]' with the correct type for categories
}): React.ReactNode {
	const {
		connections,
		role,
		selectedClue,
		gamePhase,
		buzzerQueue,
		usedClueIds,
		scores,
		hasDisplay,
		registerConnection,
		unregisterConnection,
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
	} = useGameState(sessionId);

	if (gamePhase === 'SETUP') {
		return (
			<SetupView
				connections={connections}
				registerConnection={registerConnection}
				unregisterConnection={unregisterConnection}
				sessionId={sessionId}
				role={role}
				startGame={startGame}
				gameUrl={gameUrl}
				hasDisplay={hasDisplay}
			/>
		);
	}

	if (gamePhase === 'FINISHED') {
		return <FinishedView connections={connections} scores={scores} />;
	}

	if (!role) {
		return (
			<p>
				You are not registered in this game but the game has started, please check with the host and have them revert it back to
				setup stage so you can join.
			</p>
		);
	}

	// game mode PLAYING
	if (role === 'display') {
		return (
			<DisplayView
				connections={connections}
				selectedClue={selectedClue}
				categories={categories}
				usedClueIds={usedClueIds}
				scores={scores}
				buzzerQueue={buzzerQueue}
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
			sessionId={sessionId}
			buzzIn={buzzIn}
			usedClueIds={usedClueIds}
		/>
	);
}
