const path       = require('path');
const babel      = require('rollup-plugin-babel');
const babelrc    = require('babelrc-targeted-rollup');
const commonjs   = require('rollup-plugin-commonjs');
const resolve    = require('rollup-plugin-node-resolve');
const progress   = require('rollup-plugin-progress');
const uglify     = require('rollup-plugin-uglify');
const cleanup    = require('rollup-plugin-cleanup');
const json       = require('rollup-plugin-json');
const { minify } = require('uglify-es');

const _getPathWithCustomSuffx = (p, sffx) => {
    const parts = path.parse(p);
    parts.name  = `${parts.name}.${sffx}`;
    delete parts.base;

    return path.format(parts);
};

const globalOptions = {
    exports: 'named'
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
    const configs = [];
    const targets = [
        {
            dest         : baseOptions.dest,
            format       : 'umd',
            withMinified : true,
            moduleName   : baseOptions.moduleName,
            plugins      : generateTargetPlugins('browsers')
        },
        {
            dest    : _getPathWithCustomSuffx(baseOptions.dest, 'es'),
            format  : 'es',
            plugins : generateTargetPlugins('node')
        }
    ];
    targets.forEach((targetOptions) => {
        const options      = Object.assign({}, globalOptions, baseOptions, targetOptions);
        const withMinified = options.withMinified || false;
        delete options.withMinified;
        configs.push(options);

        if (!withMinified) {
            return;
        }

        const minOptions = Object.assign({}, options, {
            dest: _getPathWithCustomSuffx(targetOptions.dest, 'min')
        });
        minOptions.plugins = minOptions.plugins.slice(0);
        minOptions.plugins.push(uglify({}, minify));
        configs.push(minOptions);
    });

    return configs;
};
