import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/models/index.ts',
	out: 'drizzle',
	dialect: 'sqlite',
});
