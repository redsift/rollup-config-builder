const path       = require('path');
const merge      = require('lodash.merge');
const babel      = require('rollup-plugin-babel');
const babelrc    = require('babelrc-targeted-rollup');
const commonjs   = require('rollup-plugin-commonjs');
const resolve    = require('rollup-plugin-node-resolve');
const progress   = require('rollup-plugin-progress');
const uglify     = require('rollup-plugin-uglify');
const cleanup    = require('rollup-plugin-cleanup');
const json       = require('rollup-plugin-json');
const { minify } = require('uglify-es');

const _getPathWithSuffx = (p, sffx) => {
    const parts = path.parse(p);
    parts.name  = `${parts.name}.${sffx}`;
    delete parts.base;

    return path.format(parts);
};

const globalOptions = {
    output: {
        exports: 'named'
    }
};

const generateTargetPlugins = target => [
    progress(),
    babel(Object.assign(babelrc(target), {
        exclude: 'node_modules/**'
    })),
    json({ indent: '    ' }),
    resolve(),
    commonjs(),
    cleanup()
];

module.exports = function (baseOptions) {
    baseOptions = Object.assign({ output: { file: null, name: null } }, baseOptions);
    if (!baseOptions.output.file) {
        throw new Error(`You must specify options.output.file`);
    }

    const configs = [];
    const targets = [
        {
            plugins : generateTargetPlugins('browsers'),
            minify  : true,
            output  : {
                file   : baseOptions.output.file,
                format : 'umd'
            }
        },
        {
            plugins : generateTargetPlugins('node'),
            output  : {
                file   : _getPathWithSuffx(baseOptions.output.file, 'es'),
                format : 'es'
            }
        }
    ];
    targets.forEach((targetOptions) => {
        const options = merge({}, globalOptions, baseOptions, targetOptions);

        const withMinified = options.minify || false;
        delete options.minify;
        configs.push(options);

        if (!withMinified) {
            return;
        }

        const minOptions = merge({}, options, {
            output: { file: _getPathWithSuffx(options.output.file, 'min') }
        });
        minOptions.plugins = minOptions.plugins.slice(0);
        minOptions.plugins.push(uglify({}, minify));
        configs.push(minOptions);
    });

    return configs;
};
