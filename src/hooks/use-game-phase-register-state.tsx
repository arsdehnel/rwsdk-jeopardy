'use client';
import { useSyncedState } from 'rwsdk/use-synced-state/client';
import { ConnectionConflictError } from '@/errors';
import type { Contestant, Role } from '@/types';

export type GamePhaseRegisterState = {
	// display
	display: string | undefined;
	registerAsDisplay: () => void;
	unregisterAsDisplay: () => void;

	// host
	host: string | undefined;
	registerAsHost: () => void;
	unregisterAsHost: () => void;

	// contestants
	contestants: Contestant[];
	registerAsContestant: (name: string, userId: string | undefined) => void;
	unregisterAsContestant: () => void;

	// calculated values
	currentUserRole: Role | undefined;
	hasDisplay: boolean;
	hasHost: boolean;
};

export default function useGamePhaseRegisterState(sessionId: string, gameId: string): GamePhaseRegisterState {
	const [host, setHost] = useSyncedState<string | undefined>(undefined, 'host', gameId);
	const [display, setDisplay] = useSyncedState<string | undefined>(undefined, 'display', gameId);
	const [contestants, setContestants] = useSyncedState<Contestant[]>([], 'contestants', gameId);

	let currentUserRole: Role | undefined;
	if (display === sessionId) {
		currentUserRole = 'display';
	} else if (host === sessionId) {
		currentUserRole = 'host';
	} else if (contestants.some(contestant => contestant.sessionId === sessionId)) {
		currentUserRole = 'contestant';
	}

	const registerAsDisplay = (): void => {
		if (currentUserRole === 'display') {
			throw new ConnectionConflictError('duplicate_id');
		}
		if (currentUserRole) {
			throw new ConnectionConflictError('role_change');
		}
		if (display) {
			throw new ConnectionConflictError('display_exists');
		}
		setDisplay(sessionId);
	};
	const unregisterAsDisplay = (): void => {
		if (currentUserRole !== 'display') {
			return;
		}
		setDisplay(undefined);
	};

	const registerAsHost = (): void => {
		if (currentUserRole === 'host') {
			throw new ConnectionConflictError('duplicate_id');
		}
		if (currentUserRole) {
			throw new ConnectionConflictError('role_change');
		}
		if (host) {
			throw new ConnectionConflictError('host_exists');
		}
		setHost(sessionId);
	};
	const unregisterAsHost = (): void => {
		if (currentUserRole !== 'host') {
			return;
		}
		setHost(undefined);
	};

	const registerAsContestant = (name: string, userId: string | undefined): void => {
		if (currentUserRole === 'contestant') {
			throw new ConnectionConflictError('duplicate_id');
		}
		if (currentUserRole) {
			throw new ConnectionConflictError('role_change');
		}
		setContestants(contestants => [...contestants.filter(c => c.sessionId !== sessionId), { sessionId, name, userId }]);
	};

	const unregisterAsContestant = (): void => {
		if (currentUserRole !== 'contestant') {
			return;
		}
		setContestants(contestants => contestants.filter(c => c.sessionId !== sessionId));
	};

	return {
		// host
		host,
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
		hasDisplay: !!display,
		hasHost: !!host,
	};
}
