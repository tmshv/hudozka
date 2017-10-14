module.exports = {
	"env": {
		"browser": true,
		"es6": true
	},
	"extends": "standard",
	"plugins": [
		"standard",
		"promise",
		"react",
	],
	"globals": {
		"angular": true,
		"DISQUS": true
	},
	"rules": {
		"semi": ["error", "never"],
		"space-before-function-paren": "off",
		"comma-dangle": "off",
		"no-tabs": "off",
		"indent": ["error", "tab"],
		"react/jsx-uses-react": "error",
		"react/jsx-uses-vars": "error",
	},
	"parserOptions": {
		"ecmaFeatures": {
			"jsx": true
		}
	}
};