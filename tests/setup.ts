import '@testing-library/jest-dom';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { relations } from '@/models';

export async function createTestDb() {
	const client = createClient({ url: ':memory:' });
	const db = drizzle({ client, relations });
	await migrate(db, { migrationsFolder: './drizzle' });
	return db;
}
