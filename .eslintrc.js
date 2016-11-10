module.exports = {
	"env": {
		"browser": true,
		"es6": true
	},
	"extends": "standard",
	"plugins": [
		"standard",
		"promise"
	],
	"globals": {
		"DISQUS": true
	},
	"rules": {
		"semi": "off",
		"space-before-function-paren": "off",
		"no-tabs": "off",
		"indent": ["error", "tab"]
	}
};