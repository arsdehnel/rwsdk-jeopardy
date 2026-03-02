export type Connection = {
	id: string;
	name: string;
	role: 'host' | 'player' | 'display';
};

export type Connections = {
	host: Connection | undefined;
	display: Connection | undefined;
	members: Connection[];
};
