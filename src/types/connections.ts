export type Connection = {
	id: string;
	name: string;
	role: 'host' | 'player' | 'display';
};

export type Connections = {
	host: Connection | undefined;
	scoreboard: Connection | undefined;
	members: Connection[];
};
