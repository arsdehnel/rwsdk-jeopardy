'use client';
import { QRCodeSVG } from 'qrcode.react';
import {
	ContestantRegistration,
	CurrentRegistration,
	DisplayRegistration,
	HostOptions,
	HostRegistration,
} from '@/components/registration';
import useGamePhase from '@/hooks/use-game-phase';
import useGamePhaseRegistrationState from '@/hooks/use-game-phase-registration-state';
import type { Permission } from '@/types';

export default function ViewGameRegistration({
	gameUrl,
	gameId,
	sessionId,
	userId,
	userPermissions,
}: {
	gameUrl: string;
	gameId: string;
	sessionId: string;
	userId?: string;
	userPermissions: Permission[];
}): React.ReactNode {
	useGamePhase(gameId, 'REGISTRATION');
	const {
		// host
		registerAsHost,
		unregisterAsHost,

		// display
		display,
		registerAsDisplay,
		unregisterAsDisplay,

		// contestants
		contestants,
		registerAsContestant,
		unregisterAsContestant,

		// calculated
		currentUserRole,
		hasDisplay,
		hasHost,
	} = useGamePhaseRegistrationState(sessionId, gameId);

	if (!sessionId) {
		return (
			<p>Sorry but there is a bug we haven't fixed yet, can you refresh your page and hopefully this message will go away.</p>
		);
	}

	return (
		<div className="view-game-registration">
			<div className="view-game-registration-actions">
				{currentUserRole ? (
					<>
						<CurrentRegistration
							currentUserRole={currentUserRole}
							unregisterAsDisplay={unregisterAsDisplay}
							unregisterAsHost={unregisterAsHost}
							unregisterAsContestant={unregisterAsContestant}
						/>
						{currentUserRole === 'host' && <HostOptions gameId={gameId} display={display} contestants={contestants} />}
					</>
				) : (
					<>
						{!hasDisplay && <DisplayRegistration registerAsDisplay={registerAsDisplay} />}
						{!hasHost && <HostRegistration registerAsHost={registerAsHost} userPermissions={userPermissions} />}
						<ContestantRegistration registerAsContestant={registerAsContestant} userId={userId} />
					</>
				)}
				<div>
					{contestants.map(c => {
						return <p key={c.sessionId}>{c.name}</p>;
					})}
				</div>
			</div>
			<div className="view-game-registration-qr-code">
				<QRCodeSVG value={gameUrl} size={400} />
			</div>
		</div>
	);
}
