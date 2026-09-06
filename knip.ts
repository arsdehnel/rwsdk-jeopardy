export default {
	tags: ['-lintignore'],
	ignoreUnresolved: ['^cloudflare:'],
	compilers: {
		css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/g)].join('\n'),
	}
};
