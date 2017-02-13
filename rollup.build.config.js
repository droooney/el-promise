const path = require('path');
const npm = require('rollup-plugin-node-resolve');
const eslint = require('rollup-plugin-eslint');
const babel = require('rollup-plugin-babel');
const inject = require('rollup-plugin-inject');

module.exports = {
  entry: './browser.js',
  dest: './build/promise.js',
  format: 'iife',
  moduleName: 'Promise',
  sourceMap: true,
  plugins: [
    npm({
      browser: true,
      preferBuiltins: false
    }),
    eslint({
      throwError: true
    }),
    babel(),
    inject({
      exclude: './lib/constants/global.js',
      modules: {
        global: path.resolve('./lib/global.js')
      }
    })
  ]
};
