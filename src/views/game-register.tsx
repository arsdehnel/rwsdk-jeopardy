'use client';
import { QRCodeSVG } from 'qrcode.react';
import { HostOptions, RegisterContestant, RegisterCurrent, RegisterDisplay, RegisterHost } from '@/components/register';
import useGamePhase from '@/hooks/use-game-phase';
import useGamePhaseRegisterState from '@/hooks/use-game-phase-register-state';
import type { Permission } from '@/types';

export default function ViewGameRegister({
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
	useGamePhase(gameId, 'REGISTER');
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
	} = useGamePhaseRegisterState(sessionId, userId, gameId);

	if (!sessionId) {
		return (
			<p>Sorry but there is a bug we haven't fixed yet, can you refresh your page and hopefully this message will go away.</p>
		);
	}

	return (
		<div className="view-game-register">
			<div className="view-game-register-actions">
				{currentUserRole ? (
					<>
						<RegisterCurrent
							currentUserRole={currentUserRole}
							unregisterAsDisplay={unregisterAsDisplay}
							unregisterAsHost={unregisterAsHost}
							unregisterAsContestant={unregisterAsContestant}
						/>
						{currentUserRole === 'host' && <HostOptions gameId={gameId} display={display} contestants={contestants} />}
					</>
				) : (
					<>
						{!hasDisplay && <RegisterDisplay registerAsDisplay={registerAsDisplay} />}
						{!hasHost && <RegisterHost registerAsHost={registerAsHost} userPermissions={userPermissions} />}
						<RegisterContestant registerAsContestant={registerAsContestant} userId={userId} />
					</>
				)}
				<div>
					{contestants.map(c => {
						return <p key={c.sessionId}>{c.name}</p>;
					})}
				</div>
			</div>
			<div className="view-game-register-qr-code">
				<QRCodeSVG value={gameUrl} size={400} />
			</div>
		</div>
	);
}
