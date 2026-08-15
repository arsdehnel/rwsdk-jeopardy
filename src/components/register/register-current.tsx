'use client';
import type { Role } from '@/types';

export function RegisterCurrent({
	currentUserRole,
	unregisterAsDisplay,
	unregisterAsHost,
	unregisterAsContestant,
}: {
	currentUserRole: Role;
	unregisterAsDisplay: () => void;
	unregisterAsHost: () => void;
	unregisterAsContestant: () => void;
}): React.ReactNode {
	if (currentUserRole === 'display') {
		return (
			<div>
				<p>Registered as Game Display</p>
				<button
					type="button"
					onClick={(): void => {
						unregisterAsDisplay();
					}}
				>
					Unregister
				</button>
			</div>
		);
	}

	if (currentUserRole === 'host') {
		return (
			<div>
				<p>Registered as Host!</p>
				<button
					type="button"
					onClick={(): void => {
						unregisterAsHost();
					}}
				>
					Unregister
				</button>
			</div>
		);
	}

	if (currentUserRole === 'contestant') {
		return (
			<div>
				<p>Registered as Contestant!</p>
				<button
					type="button"
					onClick={(): void => {
						unregisterAsContestant();
					}}
				>
					Unregister
				</button>
			</div>
		);
	}
}
