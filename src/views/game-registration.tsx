'use client';
import { QRCodeSVG } from 'qrcode.react';
import { ContestantRegistration, CurrentRegistration, DisplayRegistration, HostRegistration } from '@/components/registration';
import useGamePhaseRegistrationState from '@/hooks/use-game-phase-registration-state';

export default function ViewGameRegistration({
	gameUrl,
	gameId,
	sessionId,
	userId,
}: {
	gameUrl: string;
	gameId: string;
	sessionId: string;
	userId?: string;
}): React.ReactNode {
	const {
		// host
		registerAsHost,
		unregisterAsHost,

		// display
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
					<CurrentRegistration
						currentUserRole={currentUserRole}
						unregisterAsDisplay={unregisterAsDisplay}
						unregisterAsHost={unregisterAsHost}
						unregisterAsContestant={unregisterAsContestant}
					/>
				) : (
					<>
						{!hasDisplay && <DisplayRegistration registerAsDisplay={registerAsDisplay} />}
						{!hasHost && <HostRegistration registerAsHost={registerAsHost} />}
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
