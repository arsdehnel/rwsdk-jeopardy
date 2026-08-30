'use client';
import { useSyncedState } from 'rwsdk/use-synced-state/client';
import { ConnectionConflictError } from '@/errors';
import type { ContestantRegistration, DisplayRegistration, HostRegistration, Role } from '@/types';

export type GamePhaseRegisterState = {
	// display
	display: DisplayRegistration;
	registerAsDisplay: () => void;
	unregisterAsDisplay: () => void;

	// host
	host: HostRegistration;
	registerAsHost: () => void;
	unregisterAsHost: () => void;

	// contestants
	contestants: ContestantRegistration[];
	registerAsContestant: (name: string, userId: string | undefined) => void;
	unregisterAsContestant: () => void;

	// calculated values
	currentUserRole: Role | undefined;
	hasDisplay: boolean;
	hasHost: boolean;
};

export default function useGamePhaseRegisterState(
	sessionId: string,
	userId: string | undefined,
	gameId: string,
): GamePhaseRegisterState {
	const [host, setHost] = useSyncedState<HostRegistration>(undefined, `game:${gameId}:host`, gameId);
	const [display, setDisplay] = useSyncedState<DisplayRegistration>(undefined, `game:${gameId}:display`, gameId);
	const [contestants, setContestants] = useSyncedState<ContestantRegistration[]>([], `game:${gameId}:contestants`, gameId);

	let currentUserRole: Role | undefined;
	if (display?.sessionId === sessionId) {
		currentUserRole = 'display';
	} else if (host?.sessionId === sessionId) {
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
		setDisplay({ sessionId, userId });
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
		if (!userId) {
			throw new Error(`Host must be logged in`);
		}
		setHost({ sessionId, userId });
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
