import { env } from 'cloudflare:workers';
import { drizzle } from 'drizzle-orm/d1';
import { relations } from './models/index';

export default drizzle(env.D1_JEOPARDY, {
	relations,
});
