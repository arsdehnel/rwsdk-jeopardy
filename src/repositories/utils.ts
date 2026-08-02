const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function validateUuid(uuid: string): boolean {
	return UUID_REGEX.test(uuid);
}

export function streamlineError(err: unknown): Record<string, Error | string> {
	const cause = err instanceof Error ? err.cause : undefined;
	const errorCause = cause instanceof Error ? `: ${cause.message}` : '';
	return {
		error: err instanceof Error ? err : new Error(String(err)),
		message: errorCause,
	};
}
