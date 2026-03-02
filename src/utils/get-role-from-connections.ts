import type { Connections } from '@/types';

export default function getRoleFromConnections(
	connections: Connections,
	sessionId: string,
): 'host' | 'player' | 'display' | undefined {
	if (connections.host?.id === sessionId) {
		return 'host';
	} else if (connections.display?.id === sessionId) {
		return 'display';
	} else if (connections.members.some(member => member.id === sessionId)) {
		return 'player';
	} else {
		return undefined;
	}
}
