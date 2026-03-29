import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom',
		exclude: ['**/*.ct.test.tsx', '**/node_modules/**'],
		coverage: {
			provider: 'v8', // or 'istanbul'
			reporter: ['text', 'json-summary'],
			exclude: ['**/*.md', '**/__tests__/**', '**/*.test.ts', '**/*.integration.test.ts'],
			thresholds: {
				branches: 100,
				lines: 100,
			},
		},
		setupFiles: ['./tests/setup.ts'],
		alias: {
			'rwsdk/use-synced-state/client': path.resolve(__dirname, 'tests/mocks/rwsdk-use-synced-state.ts'),
			'@': path.resolve(__dirname, './src'),
		},
	},
});
