'use client';
import { useEffect } from 'react';
import useGameState from '@/hooks/use-game-state';
import { gamePhaseEnum } from '@/models';
import type { CategoryInGame, Permission } from '@/types';
import ContestantView from '@/views/contestant';
import DisplayView from '@/views/display';
import FinishedView from '@/views/finished';
import HostView from '@/views/host';
import SetupView from '@/views/setup';

export default function GameClient({
	gameUrl,
	gameId,
	sessionId,
	categories,
	userPermissions,
}: {
	gameUrl: string;
	gameId: string;
	sessionId: string;
	categories: CategoryInGame[]; // Replace 'any[]' with the correct type for categories
	userPermissions: Permission[];
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
		activeContestant,
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
	} = useGameState(sessionId, gameId);

	useEffect(() => {
		gamePhaseEnum.forEach((phase: string) => {
			if (phase !== gamePhase) {
				document.querySelector('body')?.classList.remove(`game-phase-${phase.toLowerCase()}`);
			} else {
				document.querySelector('body')?.classList.add(`game-phase-${phase.toLowerCase()}`);
			}
		});
	}, [gamePhase]);

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
				userPermissions={userPermissions}
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
				activeContestant={activeContestant}
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
			activeContestant={activeContestant}
		/>
	);
}
