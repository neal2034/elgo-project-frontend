module.exports = {
    "env": {
        "node": true,
        "es2021": true,
        "browser": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "settings":{
        react:{
            version: "detect"
        }
    },
    "rules": {
        "@typescript-eslint/no-explicit-any": ["off"],
        "@typescript-eslint/explicit-module-boundary-types":["off"],
        "@typescript-eslint/no-non-null-assertion":["off"],
        "@typescript-eslint/no-var-requires":"off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
    }
};
