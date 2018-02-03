const path = require('path');
const merge = require('lodash.merge');
const babel = require('rollup-plugin-babel');
const babelHelpers = require('babel-helpers');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const progress = require('rollup-plugin-progress');
const cleanup = require('rollup-plugin-cleanup');
const json = require('rollup-plugin-json');
const minify = require('rollup-plugin-babel-minify');

const _suffixPath = (p, sffx) => {
    const parts = path.parse(p);
    parts.name = `${parts.name}.${sffx}`;
    delete parts.base;

    return path.format(parts);
};

const globalOptions = {
    output: {
        exports: 'named',
    },
};

const babelrc = {
    presets: [
        [
            {
                env: {
                    modules: false,
                },
            },
        ],
    ],
    plugins: ['external-helpers'],
    exclude: 'node_modules/**',
    // NOTE: we use babel-plugin-transform-runtime to prevent clashes if 'babel-polyfill' is included via multiple bundles.
    // Therefore runtimeHelpers has to be set: (see https://github.com/rollup/rollup-plugin-babel#helpers)
    runtimeHelpers: true,
    babelrc: false,
};

// console.log('babelrc:', JSON.stringify(Object.assign(babelrc(), {
//     exclude: 'node_modules/**',
//     runtimeHelpers: true,
// }), null, 4));

module.exports = function(baseOptions) {
    baseOptions = Object.assign(
        { output: { file: null, name: null } },
        baseOptions
    );
    if (!baseOptions.output.file) {
        throw new Error(`You must specify options.output.file`);
    }

    const { namedExports } = baseOptions;

    const defaultPlugins = [
        progress(),
        babel(babelrc),
        json({ indent: '    ' }),
        resolve(),
        commonjs(namedExports ? { namedExports } : {}),
        cleanup(),
    ];

    const configs = [];
    const outputs = [
        { format: 'umd', file: _suffixPath(baseOptions.output.file, 'umd') },
        { format: 'es', file: _suffixPath(baseOptions.output.file, 'esm') },
    ];
    outputs.forEach(output => {
        const options = baseOptions.plugins
            ? merge({}, baseOptions, globalOptions, { output })
            : merge(
                  {},
                  baseOptions,
                  globalOptions,
                  { plugins: defaultPlugins },
                  {
                      output,
                  }
              );

        configs.push(options);

        // if (output.format !== 'umd') {
        //     return;
        // }

        const minOptions = merge({}, options, {
            output: { file: _suffixPath(output.file, 'min') },
        });

        minOptions.plugins = minOptions.plugins.slice(0);
        minOptions.plugins.push(minify());
        configs.push(minOptions);
    });

    return configs;
};
