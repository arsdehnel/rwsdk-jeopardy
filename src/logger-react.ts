import type { KADLogger } from '@/types';

export function createReactLogger(): KADLogger {
	const noop = (): void => {};
	return {
		debug: noop,
		info: noop,
		warn: noop,
		error: noop,
		child: () => createReactLogger(),
	};
}
