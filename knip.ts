export default {
	tags: ['-lintignore'],
	compilers: {
		css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/g)].join('\n'),
	}
};
