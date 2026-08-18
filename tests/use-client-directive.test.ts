import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Calls to these APIs at module level (outside any function) trigger CF Workers error 10021.
const BANNED_GLOBAL_SCOPE_CALLS = [
	'crypto\\.randomUUID\\(',
	'crypto\\.getRandomValues\\(',
	'Math\\.random\\(',
	'setTimeout\\(',
	'setInterval\\(',
];

function getSourceFiles(dir: string): string[] {
	const entries = readdirSync(dir, { withFileTypes: true, recursive: true });
	return entries
		.filter(e => e.isFile() && (e.name.endsWith('.ts') || e.name.endsWith('.tsx')))
		.filter(e => !e.name.includes('.test.') && !e.name.includes('.spec.'))
		.filter(e => !e.parentPath.includes('__tests__'))
		.map(e => join(e.parentPath, e.name));
}

describe('CF Workers global scope enforcement', () => {
	it('server-side route handlers must not call banned APIs at module scope', () => {
		const srcDir = join(process.cwd(), 'src');
		const files = getSourceFiles(srcDir);
		const violations: string[] = [];

		for (const file of files) {
			const content = readFileSync(file, 'utf8');

			// Client files run in the browser — no CF Workers restrictions apply.
			if (content.startsWith("'use client'")) continue;

			// Only check files that are server-side route handlers (export default (async) function).
			// These are the files where module-level code runs at Worker startup in global scope.
			// Other patterns (classes, named exports) scope their logic differently.
			const handlerStart = content.search(/^export default (async )?function\b/m);
			if (handlerStart === -1) continue;

			// Check the code before the handler function — that's the module scope.
			const moduleScope = content.slice(0, handlerStart);

			const hasBannedCall = BANNED_GLOBAL_SCOPE_CALLS.some(pattern => new RegExp(pattern).test(moduleScope));
			if (hasBannedCall) {
				violations.push(file.replace(process.cwd(), ''));
			}
		}

		expect(violations, `Files with banned API calls at module scope:\n${violations.join('\n')}`).toEqual([]);
	});
});
