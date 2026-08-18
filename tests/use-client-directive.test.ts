import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// These React hooks do not run during SSR and must not appear in the Worker bundle.
// Any file that uses them must declare 'use client' so the bundler excludes it from the server bundle.
const CLIENT_ONLY_HOOKS = ['useEffect', 'useLayoutEffect', 'useInsertionEffect'];

function getSourceFiles(dir: string): string[] {
	const entries = readdirSync(dir, { withFileTypes: true, recursive: true });
	return entries
		.filter(e => e.isFile() && (e.name.endsWith('.ts') || e.name.endsWith('.tsx')))
		.filter(e => !e.name.includes('.test.') && !e.name.includes('.spec.'))
		.filter(e => !e.parentPath.includes('__tests__'))
		.map(e => join(e.parentPath, e.name));
}

describe('use client directive enforcement', () => {
	it('files using client-only React hooks must declare "use client"', () => {
		const srcDir = join(process.cwd(), 'src');
		const files = getSourceFiles(srcDir);
		const violations: string[] = [];

		for (const file of files) {
			const content = readFileSync(file, 'utf8');

			const importsFromReact = /from ['"]react['"]/.test(content);
			if (!importsFromReact) continue;

			const usesClientOnlyHook = CLIENT_ONLY_HOOKS.some(hook => new RegExp(`\\b${hook}\\b`).test(content));
			if (!usesClientOnlyHook) continue;

			if (!content.startsWith("'use client'")) {
				violations.push(file.replace(process.cwd(), ''));
			}
		}

		expect(violations, `Files using client-only React hooks without 'use client':\n${violations.join('\n')}`).toEqual([]);
	});
});
