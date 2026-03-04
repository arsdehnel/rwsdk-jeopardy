import { describe, expect, it } from 'vitest';
import { unregisterConnection } from '@/hooks/helpers/unregister-connection';
import type { Connection, Connections } from '@/types';

const emptyConnections: Connections = {
	host: undefined,
	display: undefined,
	contestants: [],
};

const host: Connection = { id: 'host-1', name: 'Alice', role: 'host' };
const display: Connection = { id: 'display-1', name: 'TV', role: 'display' };
const player1: Connection = { id: 'player-1', name: 'Bob', role: 'contestant' };
const player2: Connection = { id: 'player-2', name: 'Carol', role: 'contestant' };

describe('unregisterConnection', () => {
	it('unregisters a host', () => {
		const connections = { ...emptyConnections, host };
		const result = unregisterConnection(connections, host.id);
		expect(result.host).toBeUndefined();
	});

	it('unregisters a display', () => {
		const connections = { ...emptyConnections, display };
		const result = unregisterConnection(connections, display.id);
		expect(result.display).toBeUndefined();
	});

	it('unregisters a contestant', () => {
		const connections = { ...emptyConnections, contestants: [player1, player2] };
		const result = unregisterConnection(connections, player1.id);
		expect(result.contestants).not.toContainEqual(player1);
		expect(result.contestants).toContainEqual(player2);
	});

	it('unregisters the only contestant', () => {
		const connections = { ...emptyConnections, contestants: [player1] };
		const result = unregisterConnection(connections, player1.id);
		expect(result.contestants).toHaveLength(0);
	});

	it('does not affect other roles when unregistering a contestant', () => {
		const connections = { ...emptyConnections, host, contestants: [player1] };
		const result = unregisterConnection(connections, player1.id);
		expect(result.host).toEqual(host);
	});

	it('silently succeeds when unregistering an id that does not exist', () => {
		const result = unregisterConnection(emptyConnections, 'nonexistent-id');
		expect(result).toEqual(emptyConnections);
	});
});
