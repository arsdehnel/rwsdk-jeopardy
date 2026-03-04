import type { Connection } from './connection';

export type Connections = {
	host: Connection | undefined;
	display: Connection | undefined;
	contestants: Connection[];
};
