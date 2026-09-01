import { env } from 'cloudflare:workers';

type AEDSessionLifecycleDataPoint = {
	event: 'LOAD' | 'UPSERT' | 'CLEAR' | 'INVALID' | 'EXPIRED' | 'RESET';
	sessionId?: string;
	userId?: string | null;
};

export function sessionLifecycleEvent(dataPoint: AEDSessionLifecycleDataPoint): void {
	// convert to CF's somewhat goofy data point structure
	const indexes = [dataPoint.userId ? dataPoint.userId : 'unknown', dataPoint.sessionId ? dataPoint.sessionId : 'no-session'];
	const blobs = [dataPoint.event];

	try {
		env.AED_SESSION_LIFECYCLE.writeDataPoint({ indexes, blobs });
	} catch {
		// binding may be unavailable in test environments or local dev without analytics configured
	}
}
