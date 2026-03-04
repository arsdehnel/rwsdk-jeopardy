export type Connection = {
	id: string;
	name: string;
	role: 'host' | 'contestant' | 'display';
};

export type Connections = {
	host: Connection | undefined;
	display: Connection | undefined;
	contestants: Connection[];
};
