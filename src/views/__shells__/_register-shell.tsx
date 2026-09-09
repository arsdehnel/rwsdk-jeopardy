'use client';
import { QRCodeSVG } from 'qrcode.react';
import { HostOptions, RegisterContestant, RegisterCurrent, RegisterDisplay, RegisterHost } from '@/components/register';
import type { ContestantRegistration, DisplayRegistration, Permission, Role } from '@/types';

export default function RegisterShell({
	currentUserRole,
	hasHost,
	hasDisplay,
	display,
	contestants,
	userPermissions,
	gameRegistrationUrl,
}: {
	currentUserRole?: Role;
	hasHost: boolean;
	hasDisplay: boolean;
	display?: DisplayRegistration;
	contestants: ContestantRegistration[];
	userPermissions: Permission[];
	gameRegistrationUrl: string;
}): React.ReactNode {
	return (
		<div className="view-game-register">
			<div className="view-game-register-actions">
				{currentUserRole ? (
					<>
						<RegisterCurrent
							currentUserRole={currentUserRole}
							unregisterAsDisplay={(): void => {}}
							unregisterAsHost={(): void => {}}
							unregisterAsContestant={(): void => {}}
						/>
						{currentUserRole === 'host' && (
							<HostOptions gameId="mock-game-id" display={display} contestants={contestants} onStartGame={(): void => {}} />
						)}
					</>
				) : (
					<>
						{!hasDisplay && <RegisterDisplay registerAsDisplay={(): void => {}} />}
						{!hasHost && <RegisterHost registerAsHost={(): void => {}} userPermissions={userPermissions} />}
						<RegisterContestant registerAsContestant={(): void => {}} userId={undefined} />
					</>
				)}
				<div>
					{contestants.map(c => (
						<p key={c.sessionId}>{c.name}</p>
					))}
				</div>
			</div>
			<div className="view-game-register-qr-code">
				<QRCodeSVG value={gameRegistrationUrl} size={400} />
			</div>
		</div>
	);
}
