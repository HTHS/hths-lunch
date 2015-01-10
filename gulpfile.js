var gulp = require('gulp'),
  del = require('del'),
  karma = require('karma').server,
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  mocha = require('gulp-mocha'),
  istanbul = require('gulp-istanbul'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  plato = require('gulp-plato'),
  nodemon = require('gulp-nodemon');

/***********
 * Helpers *
 ***********/
function testEnv(cb) {
  process.env.NODE_ENV = 'test';

  cb();
}

function clean() {
  del.sync('public/app.js');
}

/*******
 * CSS *
 *******/
function sass() {
  gulp.src('public/sass/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/styles'));

  gulp.src('public/modules/**/*.scss')
    .pipe(sass())
    .pipe(rename(function(path) {
      path.dirname = path.dirname.replace('sass', 'styles');
    }))
    .pipe(gulp.dest('public/modules/'));
}

/**************
 * JavaScript *
 **************/
function jsConcat() {
  return gulp.src([
      'lib/chartist/dist/chartist.min.js',
      'lib/angular/angular.min.js',
      'lib/angular-aria/angular-aria.min.js',
      'lib/angular-animate/angular-animate.min.js',
      'lib/hammerjs/hammer.min.js',
      'lib/angular-material/angular-material.min.js',
      'lib/angular-resource/angular-resource.min.js',
      'lib/angular-ui-router/release/angular-ui-router.min.js',
      'modules/app.js',
      'modules/**/*.js'
    ], {
      cwd: 'public'
    })
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('public'))
    // .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public'));
}

/*********
 * Tests *
 *********/
function mochaTest() {
  gulp.src([
      'app/**/*.js',
      'config/**/*.js',
      'public/modules/**/*.js'
    ])
    .pipe(istanbul())
    .on('finish', function() {
      var server = require('./server');

      return gulp.src('./test/**/*.js')
        .pipe(mocha({
          // reporter: 'mocha-lcov-reporter'
        }))
        .pipe(istanbul.writeReports())
        .once('end', function() {
          server.kill();
        });
    });
}

function karmaTest() {
  return karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  });
}

/************
 * Analysis *
 ************/
function plato() {
  // plato.inspect([
  // 	'app/**/*.js',
  // 	'config/**/*.js',
  // 	'public/modules/**/*.js'
  // 	],
  // 	'report',
  // 	{
  // 		jshint: {},
  // 		complexity: {
  // 			trycatch: true
  // 		}
  // 	});

  return gulp.src([
      'app/**/*.js',
      'config/**/*.js',
      'public/modules/**/*.js'
    ])
    .pipe(plato('report', {
      jshint: {},
      complexity: {
        trycatch: true
      }
    }));
}

/*****************
 * Development   *
 *****************/
function watch() {
  gulp
    .watch([
      'public/**/*.js',
      '!public/*.js'
    ], jsConcat)
    .on('change', function(event) {
      console.log('File %s was %s, running tasks...', event.path, event.type);
    });

  gulp
    .watch('public/**/*.scss', sass)
    .on('change', function(event) {
      console.log('File %s was %s, running tasks...', event.path, event.type);
    });
}

function nodemon() {
  return nodemon({
      script: 'server.js',
      ext: 'js scss',
      ignore: [
        'node_modules/',
        'coverage/',
        'report/',
        'test/',
        'public/lib/',
        'gulpfile.js'
      ]
    })
    .on('change', 'build');
}

/*******************
 * Composite tasks *
 *******************/

/**************
 * Test tasks *
 **************/
gulp.task('test', gulp.series(testEnv, gulp.parallel(mochaTest, karmaTest)));

/*********************
 * Development tasks *
 *********************/
gulp.task('analysis', gulp.parallel(plato));
gulp.task('watch', watch);
gulp.task('dev', nodemon);

/**********************
 * Production tasks   *
 **********************/
gulp.task('build', gulp.parallel(clean, sass, jsConcat));

gulp.task('default', function() {
  // place code for your default task here
});
