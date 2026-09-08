'use client';
import { QRCodeSVG } from 'qrcode.react';
import { RegisterContestant } from '@/components/register/register-contestant';
import { RegisterCurrent } from '@/components/register/register-current';
import { RegisterDisplay } from '@/components/register/register-display';
import { RegisterHost } from '@/components/register/register-host';
import type { ContestantRegistration, Permission, Role } from '@/types';

export default function RegisterShell({
	currentUserRole,
	hasHost,
	hasDisplay,
	contestants,
	userPermissions,
	gameRegistrationUrl,
}: {
	currentUserRole?: Role;
	hasHost: boolean;
	hasDisplay: boolean;
	contestants: ContestantRegistration[];
	userPermissions: Permission[];
	gameRegistrationUrl: string;
}): React.ReactNode {
	return (
		<div className="view-game-register">
			<div className="view-game-register-actions">
				{currentUserRole ? (
					<RegisterCurrent
						currentUserRole={currentUserRole}
						unregisterAsDisplay={(): void => {}}
						unregisterAsHost={(): void => {}}
						unregisterAsContestant={(): void => {}}
					/>
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
