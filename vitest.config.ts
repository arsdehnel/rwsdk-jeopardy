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
				branches: 30,
				lines: 30, // using this to make sure we don't miss something big or have dead code
				'src/actions/**': {
					branches: 91,
				},
				'src/classes/**': {
					branches: 60,
				},
				'src/durable-objects/**': {
					branches: 100,
				},
				'src/middleware/**': {
					branches: 100,
				},
				'src/repositories/**': {
					branches: 77,
				},
				'src/schemas/**': {
					branches: 0,
				},
			},
		},
		setupFiles: ['./tests/setup.ts'],
		alias: {
			'cloudflare:workers': path.resolve(__dirname, 'tests/mocks/cloudflare-workers.ts'),
			'rwsdk/auth': path.resolve(__dirname, 'tests/mocks/rwsdk-auth.ts'),
			'rwsdk/use-synced-state/client': path.resolve(__dirname, 'tests/mocks/rwsdk-use-synced-state.ts'),
			'@/db': path.resolve(__dirname, 'tests/mocks/db.ts'),
			'@': path.resolve(__dirname, './src'),
		},
	},
});
