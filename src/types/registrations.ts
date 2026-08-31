export type DisplayRegistration =
	| undefined
	| {
			sessionId: string;
			userId?: string;
	  };

export type HostRegistration =
	| undefined
	| {
			sessionId: string;
			userId: string;
	  };

export type ContestantRegistration = {
	id?: string;
	sessionId: string;
	userId?: string;
	name: string;
};
