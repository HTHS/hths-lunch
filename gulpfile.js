var gulp = require('gulp');

var assets = {
  test: {
    scss: [
      'public/sass/**/*.scss',
      'public/modules/**/*.scss'
    ],
    js: [
      'lib/chartist/dist/chartist.js',
      'lib/angular/angular.js',
      'lib/angular-mocks/angular-mocks.js',
      'lib/angular-aria/angular-aria.js',
      'lib/angular-animate/angular-animate.js',
      'lib/angular-material/angular-material.min.js',
      'lib/angular-resource/angular-resource.js',
      'lib/angular-ui-router/release/angular-ui-router.js',
      'modules/app.js',
      'modules/**/*.js'
    ]
  },
  development: {
    scss: [
      'public/sass/**/*.scss',
      'public/modules/**/*.scss'
    ],
    js: [
      'lib/chartist/dist/chartist.js',
      'lib/angular/angular.js',
      'lib/angular-aria/angular-aria.min.js',
      'lib/angular-animate/angular-animate.min.js',
      'lib/angular-material/angular-material.min.js',
      'lib/angular-resource/angular-resource.min.js',
      'lib/angular-ui-router/release/angular-ui-router.min.js',
      'modules/app.js',
      'modules/**/*.js'
    ]
  },
  production: {
    scss: [
      'public/sass/**/*.scss',
      'public/modules/**/*.scss'
    ],
    js: [
      'lib/chartist/dist/chartist.min.js',
      'lib/angular/angular.min.js',
      'lib/angular-aria/angular-aria.min.js',
      'lib/angular-animate/angular-animate.min.js',
      'lib/angular-material/angular-material.min.js',
      'lib/angular-resource/angular-resource.min.js',
      'lib/angular-ui-router/release/angular-ui-router.min.js',
      'modules/app.js',
      'modules/**/*.js'
    ]
  }
};

/***********
 * Helpers *
 ***********/
function testEnv(cb) {
  process.env.NODE_ENV = 'test';

  cb();
}

function clean(cb) {
  var del = require('del');

  del.sync('public/app.*');
  del.sync('public/styles/');
  del.sync('public/modules/*/styles/');

  cb();
}

/*******
 * CSS *
 *******/
function scss(cb) {
  var sass = require('gulp-sass');
  var rename = require('gulp-rename');

  gulp.src('public/sass/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/styles'));

  gulp.src('public/modules/**/*.scss')
    .pipe(sass())
    .pipe(rename(function(path) {
      path.dirname = path.dirname.replace('sass', 'styles');
    }))
    .pipe(gulp.dest('public/modules/'));

  cb();
}

/**************
 * JavaScript *
 **************/
function js(cb) {
  var concat = require('gulp-concat');
  var rename = require('gulp-rename');
  var sourcemaps = require('gulp-sourcemaps');
  var uglify = require('gulp-uglify');

  var jsFiles;

  switch (process.env.NODE_ENV) {
    case 'development':
      jsFiles = assets.development.js;
      break;
    case 'production':
      jsFiles = assets.production.js;
      break;
    case 'test':
      jsFiles = assets.test.js;
      break;
    default:
      jsFiles = assets.development.js;
  }

  gulp.src(jsFiles, {
      cwd: 'public'
    })
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public'))
    // .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public'));

  cb();
}

/*********
 * Tests *
 *********/
function mochaTest(cb) {
  var mocha = require('gulp-mocha');
  var istanbul = require('gulp-istanbul');

  // gulp.src([
  //     'app/**/*.js',
  //     'config/**/*.js',
  //     'public/modules/**/*.js'
  //   ])
  //   .pipe(istanbul())
  //   .on('finish', function() {
  //     var server = require('./server');
  //
  //     gulp.src('./test/**/*.js')
  //       .pipe(mocha({
  //         // reporter: 'mocha-lcov-reporter'
  //       }))
  //       .pipe(istanbul.writeReports())
  //       .on('end', function() {
  //         server.kill();
  //
  //         cb();
  //       });
  //   });
  var server = require('./server');

  gulp.src('./test/server/**/*.js')
    .pipe(mocha())
    .on('end', function() {
      server.kill();

      cb();
    });
}

function karmaTest(cb) {
  var karma = require('karma').server;

  return karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, cb);
}

/************
 * Analysis *
 ************/
function plato(cb) {
  var glob = require('glob');
  var plato = require('plato');

  var files = glob.sync('./app/**/*.js')
    .concat(glob.sync('./config/**/*.js'))
    .concat(glob.sync('./public/modules/**/*.js'));

  return plato.inspect([
    './app/**/*.js',
    './config/**/*.js',
    './public/modules/**/*.js'
  ], './report', {
    title: 'Plato report'
  }, function(reports) {
    var overview = plato.getOverviewReport(reports);
    console.log(overview.summary);

    if (cb) {
      cb();
    }
  });
}

/*****************
 * Development   *
 *****************/
function watch() {
  gulp
    .watch([
      'public/**/*.js',
      '!public/*.js'
    ], js)
    .on('change', function(event) {
      console.log('File %s was %s, running tasks...', event.path, event.type);
    });

  gulp
    .watch('public/**/*.scss', scss)
    .on('change', function(event) {
      console.log('File %s was %s, running tasks...', event.path, event.type);
    });
}

function nodemon() {
  var nodemon = require('gulp-nodemon');

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
    .on('change', tasks.build);
}

/*******************
 * Composite tasks *
 *******************/
var tasks = {
  test: gulp.series(testEnv, js, mochaTest, karmaTest),
  analyze: gulp.parallel(plato),
  build: gulp.series(clean, gulp.parallel(scss, js))
};

/**************
 * Test tasks *
 **************/
gulp.task('test', tasks.test);

/*********************
 * Development tasks *
 *********************/
gulp.task('analyze', tasks.analyze);
gulp.task('watch', watch);
gulp.task('dev', nodemon);

/**********************
 * Production tasks   *
 **********************/
gulp.task('build', tasks.build);

gulp.task('default', tasks.build);
