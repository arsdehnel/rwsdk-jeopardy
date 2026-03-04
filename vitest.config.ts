import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./tests/setup.ts'],
		alias: {
			'rwsdk/use-synced-state/client': path.resolve(__dirname, 'tests/mocks/rwsdk-use-synced-state.ts'),
			'@': path.resolve(__dirname, './src'),
		},
	},
});
