import { describe, expect, it } from 'vitest';
import { ConnectionConflictError } from '@/errors';
import { registerConnection } from '@/hooks/helpers/register-connection';
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

describe('registerConnection', () => {
	it('registers a host', () => {
		const result = registerConnection(emptyConnections, host);
		expect(result.host).toEqual(host);
	});

	it('registers a display', () => {
		const result = registerConnection(emptyConnections, display);
		expect(result.display).toEqual(display);
	});

	it('registers a contestant', () => {
		const result = registerConnection(emptyConnections, player1);
		expect(result.contestants).toContainEqual(player1);
	});

	it('registers multiple contestants', () => {
		const after1 = registerConnection(emptyConnections, player1);
		const after2 = registerConnection(after1, player2);
		expect(after2.contestants).toHaveLength(2);
		expect(after2.contestants).toContainEqual(player1);
		expect(after2.contestants).toContainEqual(player2);
	});

	it('does not affect other roles when registering a contestant', () => {
		const withHost = registerConnection(emptyConnections, host);
		const result = registerConnection(withHost, player1);
		expect(result.host).toEqual(host);
	});

	it('throws a conflict error when a host already exists', () => {
		const connections = { ...emptyConnections, host };
		const newHost: Connection = { id: 'host-2', name: 'Dave', role: 'host' };
		expect(() => registerConnection(connections, newHost)).toThrowError(ConnectionConflictError);
		expect(() => registerConnection(connections, newHost)).toThrow('host_exists');
	});

	it('throws a conflict error when a display already exists', () => {
		const connections = { ...emptyConnections, display };
		const newDisplay: Connection = { id: 'display-2', name: 'TV2', role: 'display' };
		expect(() => registerConnection(connections, newDisplay)).toThrowError(ConnectionConflictError);
		expect(() => registerConnection(connections, newDisplay)).toThrow('display_exists');
	});

	it('throws a conflict error when a contestant tries to register as a host', () => {
		const connections = { ...emptyConnections, contestants: [player1] };
		const contestantAsHost: Connection = { id: player1.id, name: player1.name, role: 'host' };
		expect(() => registerConnection(connections, contestantAsHost)).toThrowError(ConnectionConflictError);
		expect(() => registerConnection(connections, contestantAsHost)).toThrow('role_change');
	});

	it('throws a conflict error when a display tries to register as a host', () => {
		const connections = { ...emptyConnections, display };
		const displayAsHost: Connection = { id: display.id, name: display.name, role: 'host' };
		expect(() => registerConnection(connections, displayAsHost)).toThrowError(ConnectionConflictError);
		expect(() => registerConnection(connections, displayAsHost)).toThrow('role_change');
	});

	it('throws a conflict error when a host tries to register as a contestant', () => {
		const connections = { ...emptyConnections, host };
		const hostAsContestant: Connection = { id: host.id, name: host.name, role: 'contestant' };
		expect(() => registerConnection(connections, hostAsContestant)).toThrowError(ConnectionConflictError);
		expect(() => registerConnection(connections, hostAsContestant)).toThrow('role_change');
	});

	it('throws a duplicate_id error when registering a contestant with an existing id', () => {
		const connections = { ...emptyConnections, contestants: [player1] };
		expect(() => registerConnection(connections, player1)).toThrowError(ConnectionConflictError);
		expect(() => registerConnection(connections, player1)).toThrow('duplicate_id');
	});

	it('throws when registering a connection with a blank id', () => {
		const blankId: Connection = { id: '', name: 'Ghost', role: 'contestant' };
		expect(() => registerConnection(emptyConnections, blankId)).toThrow();
	});
});
