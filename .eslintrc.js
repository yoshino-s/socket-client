module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: [
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "prettier",
    "prettier/@typescript-eslint",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "quotes": [2, "double", "avoid-escape"],
    "comma-dangle": ["error", "always-multiline"],
    "semi": ["error", "always"],
    "eol-last": ["error", "always"],
    "import/no-unresolved": "off",
    "import/no-named-as-default": "off",
    "import/order": [
      "error",
      {
        "newlines-between": "always",
      },
    ],
  },
};
