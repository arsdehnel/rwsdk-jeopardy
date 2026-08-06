import '@testing-library/jest-dom';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { _relations } from '@/models';

export async function createTestDb() {
	const client = createClient({ url: ':memory:' });
	const db = drizzle({ client, relations: _relations });
	await migrate(db, { migrationsFolder: './drizzle' });
	return db;
}
