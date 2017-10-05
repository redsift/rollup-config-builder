## 0.5.0 (2017-10-05)
- Change the way options passed to the lib are handled.  
  Theses options are now overwrited by the lib options in case of conflict.
- Fix a bug with the `.es.js` version, that contained code not supported by IE 11.  
  (e.g. `class`, `let`)
- Temporary fix a rollup regression with babel-helpers incorrectly included in packages.

## 0.4.1 (2017-09-11)
- Fix the `exports` option position.

## 0.4.0 (2017-09-11)
- Update rollup to 0.49.
- __Breaking:__ Changes in options, see https://rollupjs.org/#big-list-of-options
- Add rollup to peerDependencies.

## 0.3.0 (2017-08-01)
- __Breaking:__ Force named exports even with a single default export.
- Add installation and usage guide in the `README.md`.
- Update ESLint to 4.3.0.
- Update uglify-es.

## 0.2.0 (2017-06-30)
- Add json files support.

## 0.1.1 (2017-06-29)
- Add missing `external-helpers` dependency.

## 0.1.0 (2017-06-29)
- First version.
