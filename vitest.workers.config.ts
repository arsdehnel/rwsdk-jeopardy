import path from 'node:path';
import { cloudflarePool } from '@cloudflare/vitest-pool-workers';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	test: {
		include: ['src/**/*.workers.test.ts'],
		pool: cloudflarePool({
			main: './src/durable-objects/sessions.ts',
			wrangler: { configPath: './wrangler.jsonc' },
			miniflare: {
				vars: { SESSION_SECRET_KEY: 'test-secret-key-for-workers-tests' },
			},
		}),
	},
});
