export default {
	tags: ['-lintignore', '-knipTestExport'],
	ignoreDependencies: ['cloudflare'],
	compilers: {
		css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/g)].join('\n'),
	}
};
