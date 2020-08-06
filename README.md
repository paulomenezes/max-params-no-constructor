# eslint-plugin-max-params-no-constructor

Detect functions with too many parameters without the constructor

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

or if you use `yarn`

```
$ yarn add eslint -D
```

Next, install `eslint-plugin-max-params-no-constructor`:

```
$ npm install eslint-plugin-max-params-no-constructor --save-dev
```

or

```
$ yarn add eslint-plugin-max-params-no-constructor -D
```

## Usage

Add `max-params-no-constructor` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["max-params-no-constructor"],
  "rules": {
    "max-params-no-constructor/max-params-no-constructor": ["error", 5]
  }
}
```
