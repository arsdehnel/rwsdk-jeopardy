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

export function isHostRegistration(v: unknown): v is NonNullable<HostRegistration> {
	if (typeof v !== 'object' || v === null) return false;
	const r = v as Record<string, unknown>;
	return typeof r.sessionId === 'string' && typeof r.userId === 'string';
}

export function isDisplayRegistration(v: unknown): v is NonNullable<DisplayRegistration> {
	if (typeof v !== 'object' || v === null) return false;
	const r = v as Record<string, unknown>;
	return typeof r.sessionId === 'string';
}

export function isGameContestants(v: unknown): v is ContestantRegistration[] {
	if (!Array.isArray(v)) return false;
	return v.every(item => {
		if (typeof item !== 'object' || item === null) return false;
		const r = item as Record<string, unknown>;
		return (
			typeof r.sessionId === 'string' &&
			typeof r.name === 'string' &&
			(r.id === undefined || typeof r.id === 'string') &&
			(r.userId === undefined || typeof r.userId === 'string')
		);
	});
}
