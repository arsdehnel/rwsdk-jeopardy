import { ConnectionConflictError } from '@/errors';
import type { Connection, Connections } from '@/types';

export function registerConnection(connections: Connections, connection: Connection): Connections {
	if (!connection.id) {
		throw new ConnectionConflictError('missing_id');
	}
	if (connections.contestants.some(c => c.id === connection.id) && connection.role !== 'contestant') {
		throw new ConnectionConflictError('role_change');
	}
	if (connections.host?.id === connection.id && connection.role !== 'host') {
		throw new ConnectionConflictError('role_change');
	}
	if (connections.display?.id === connection.id && connection.role !== 'display') {
		throw new ConnectionConflictError('role_change');
	}

	if (connection.role === 'host') {
		if (connections.host) {
			throw new ConnectionConflictError('host_exists');
		}
		return { ...connections, host: connection };
	} else if (connection.role === 'display') {
		if (connections.display) {
			throw new ConnectionConflictError('display_exists');
		}
		return { ...connections, display: connection };
	} else {
		if (connections.contestants.some(c => c.id === connection.id)) {
			throw new ConnectionConflictError('duplicate_id');
		}
		return { ...connections, contestants: [...connections.contestants, connection] };
	}
}
