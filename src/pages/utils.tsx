import { env } from 'cloudflare:workers';
import type { KADLogger } from '@/types';

export function caughtError(err: unknown, logger: KADLogger): React.JSX.Element {
	logger.error('Unexpected error in Pages__Games__Edit', { err: err instanceof Error ? err : new Error(String(err)) });
	if (env.RWSDK_JEOPARDY_ENV === 'production') {
		return <p>Unexpected error occurred. Please try again later.</p>;
	}
	const cause = err instanceof Error ? err.cause : undefined;
	if (err instanceof Error) {
		if (cause instanceof Error) {
			return <p>Unexpected error occurred: {cause.message}</p>;
		}
		if (cause) {
			return <p>Unexpected error occurred: {String(cause)}</p>;
		}
		return <p>Unexpected error occurred: {err.message}</p>;
	}
	return <p>Unexpected error occurred: {String(err)}</p>;
}
