export default {
	tags: ['-lintignore', '-knipTestExport'],
	ignoreDependencies: ['cloudflare'],
	ignoreExportsUsedInFile: true,
	ignoreFiles: ['src/client.tsx', 'tests/mocks/*'],
	compilers: {
		css: (text: string): string => [...text.matchAll(/(?<=@)import[^;]+/g)].join('\n'),
	},
};
