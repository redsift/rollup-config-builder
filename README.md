# rollup-config-builder

## Installation

```bash
yarn add --dev rollup rollup-config-builder
```

## Usage

Your project need to have Babel configured.  
Please see [`babelrc-targeted-rollup`](https://www.npmjs.com/package/babelrc-targeted-rollup) for optimal configuration.

Then, in your ___rollup.config.js___:

```js
import buildConfig from 'rollup-config-builder';
import del         from 'del';

del.sync(['./dist']);
export default buildConfig({
    entry      : `./src/my-module.js`,
    dest       : `./dist/my-module.js`,
    moduleName : 'MyModule'
});
```

Will produce:

```
/dist
├── my-module.es.js  <--- ES6 module file. (for the `module` field in `package.json`) 
├── my-module.js     <--- UMD (for the `main` field in `package.json`)
└── my-module.min.js <--- UMD, minified.
```
