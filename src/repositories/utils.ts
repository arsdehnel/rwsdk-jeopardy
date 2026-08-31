export function streamlineError(err: unknown): Record<string, Error | string> {
	const cause = err instanceof Error ? err.cause : undefined;
	const errorCause = cause instanceof Error ? `: ${cause.message}` : '';
	return {
		error: err instanceof Error ? err : new Error(String(err)),
		message: errorCause,
	};
}
