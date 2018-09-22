module.exports = {
    "extends": "airbnb-base",
    "parserOptions": {
        "ecmaVersion": 2017,
        "sourceType": "module",
    },
    "env": { 
        "es6": true, 
        "browser": true,
        "node": true,
    },

    rules: {
        "arrow-parens": ["error", "always"],
    }
};