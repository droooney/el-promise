const gulp = require('gulp');
const _ = require('lodash');
const rollup = require('rollup');
const rollupStream = require('rollup-stream');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const watch = require('rollup-watch');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');

const createServer = require('./server');

const rollupDevConfig = require('./rollup.dev.config');
const rollupBuildConfig = require('./rollup.build.config');
const rollupTestConfig = require('./rollup.test.config');
const config = require('./config.json');

const devServer = createServer();
const testServer = createServer(true);

gulp.task('default', ['server:dev'], () => {
  const watcher = watch(rollup, rollupDevConfig);

  watcher.on('event', (event) => {
    console.log(event);
  });
});

gulp.task('build', ['build:default', 'build:min']);

gulp.task('test', ['server:test'], () => {
  const watcher = watch(rollup, rollupTestConfig);

  watcher.on('event', (event) => {
    console.log(event);
  });
});

gulp.task('server:dev', () => (
  devServer.listen(config.devServer.port)
));

gulp.task('server:test', () => (
  testServer.listen(config.testServer.port)
));

gulp.task('build:default', () => {
  const config = _.cloneDeep(rollupBuildConfig);

  return rollupStream(config)
    .pipe(source('promise.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build'));
});

gulp.task('build:min', () => {
  const config = _.cloneDeep(rollupBuildConfig);

  config.plugins.push(uglify());

  return rollupStream(config)
    .pipe(source('promise.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build'));
});
