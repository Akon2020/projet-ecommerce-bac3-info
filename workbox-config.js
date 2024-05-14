module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{png,webmanifest,js,html,json,css}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};