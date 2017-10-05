const path       = require('path');
const merge      = require('lodash.merge');
const babel      = require('rollup-plugin-babel');
const babelrc    = require('babelrc-rollup').default;
const commonjs   = require('rollup-plugin-commonjs');
const resolve    = require('rollup-plugin-node-resolve');
const progress   = require('rollup-plugin-progress');
const uglify     = require('rollup-plugin-uglify');
const cleanup    = require('rollup-plugin-cleanup');
const json       = require('rollup-plugin-json');
const { minify } = require('uglify-es');

const _suffixPath = (p, sffx) => {
    const parts = path.parse(p);
    parts.name  = `${parts.name}.${sffx}`;
    delete parts.base;

    return path.format(parts);
};

const globalOptions = {
    output: {
        exports: 'named'
    },
    plugins: [
        progress(),
        babel(Object.assign(babelrc(), {
            exclude: 'node_modules/**'
        })),
        json({ indent: '    ' }),
        resolve(),
        commonjs(),
        cleanup()
    ]
};

module.exports = function (baseOptions) {
    baseOptions = Object.assign({ output: { file: null, name: null } }, baseOptions);
    if (!baseOptions.output.file) {
        throw new Error(`You must specify options.output.file`);
    }

    const configs = [];
    const outputs = [
        { format: 'umd', file: baseOptions.output.file },
        { format: 'es', file: _suffixPath(baseOptions.output.file, 'es') }
    ];
    outputs.forEach((output) => {
        const options = merge({}, baseOptions, globalOptions, { output });
        configs.push(options);

        if (output.format !== 'umd') {
            return;
        }

        const minOptions = merge({}, options, {
            output: { file: _suffixPath(output.file, 'min') }
        });
        minOptions.plugins = minOptions.plugins.slice(0);
        minOptions.plugins.push(uglify({}, minify));
        configs.push(minOptions);
    });

    return configs;
};
