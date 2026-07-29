import { cloudflare } from '@cloudflare/vite-plugin';
import { redwood } from 'rwsdk/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	css: {
		modules: {
			localsConvention: 'camelCase',
		},
	},
	plugins: [
		cloudflare({
			viteEnvironment: { name: 'worker' },
		}),
		redwood(),
	],
});
