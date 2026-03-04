import type { Connections } from '@/types';

export function unregisterConnection(connections: Connections, connectionId: string): Connections {
	if (connections.host?.id === connectionId) {
		return { ...connections, host: undefined };
	} else if (connections.display?.id === connectionId) {
		return { ...connections, display: undefined };
	} else {
		return { ...connections, contestants: connections.contestants.filter(contestant => contestant.id !== connectionId) };
	}
}
