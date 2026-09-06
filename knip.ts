export default {
	tags: ['-lintignore'],
	ignoreDependencies: ['cloudflare'],
	compilers: {
		css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/g)].join('\n'),
	}
};
