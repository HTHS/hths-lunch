var gulp = require('gulp'),
	del = require('del'),
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
gulp.task('env:test', function testEnv() {
	process.env.NODE_ENV = 'test';
});

/*******
 * CSS *
 *******/
gulp.task('sass', function sass() {
	gulp.src([
			'public/sass/**/*.scss'
		], {
			read: false
		})
		.pipe(sass())
		.pipe(gulp.dest('public/styles'));

	gulp.src([
			'public/modules/**/*.scss'
		], {
			read: false
		})
		.pipe(sass())
		.pipe(rename(function renameScssFiles(path) {
			path.dirname = path.dirname.replace('sass', 'styles');
		}))
		.pipe(gulp.dest('public/modules/'));
});

/**************
 * JavaScript *
 **************/
gulp.task('concat', function() {
	del.sync('public/app.js');

	return gulp.src([
			'lib/jquery/dist/jquery.min.js',
			'lib/angular/angular.min.js',
			'lib/angular-animate/angular-animate.min.js',
			'lib/hammerjs/hammer.min.js',
			'lib/angular-material/angular-material.min.js',
			'lib/angular-ui-router/release/angular-ui-router.min.js',
			'lib/angular-resource/angular-resource.min.js',
			'lib/foundation/js/vendor/modernizr.js',
			'lib/foundation/js/foundation.min.js',
			'modules/app.js',
			'modules/**/*.js'
		], {
			cwd: 'public',
			read: false
		})
		.pipe(sourcemaps.init())
		.pipe(concat('app.js'))
		.pipe(gulp.dest('public/'))
		.pipe(rename('app.min.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('public/'));
});

/*********
 * Tests *
 *********/
gulp.task('mocha', ['env:test'], function() {
	var mongoose = require('./config/mongoose');

	gulp.src(['app/**/*.js', 'config/**/*.js', 'public/modules/**/*.js'])
		.pipe(istanbul())
		.on('finish', function onIstanbulEnd() {

			var server = require('./server');

			return gulp.src('./test/**/*.js')
				.pipe(mocha({
					// reporter: 'mocha-lcov-reporter'
				}))
				.pipe(istanbul.writeReports())
				.once('end', function onMochaEnd() {
					server.kill();
				});
		});
});

/************
 * Analysis *
 ************/
gulp.task('plato', function plato() {
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

	return gulp.src(['app/**/*.js', 'config/**/*.js', 'public/modules/**/*.js'])
		.pipe(plato('report', {
			jshint: {},
			complexity: {
				trycatch: true
			}
		}));
});

gulp.task('analysis', ['plato']);

/*******************
 * Composite tasks *
 *******************/

/*********************
 * Development tasks *
 *********************/
gulp.task('watch', function watch() {
	gulp
		.watch(['public/**/*.js', '!public/*.js'], {}, ['concat'])
		.on('change', function logJsEvents(event) {
			console.log('File %s was %s, running tasks...', event.path, event.type);
		});

	gulp
		.watch('public/**/*.scss', {}, ['sass'])
		.on('change', function logScssEvents(event) {
			console.log('File %s was %s, running tasks...', event.path, event.type);
		});
});

gulp.task('test', ['mocha'], function test() {

});

gulp.task('dev', [], function dev() {
	return nodemon({
			script: 'server.js',
			ext: 'js',
			ignore: [
				'coverage/',
				'report/',
				'test/',
				'gulpfile.js'
			]
		})
		.on('change', ['sass', 'concat']);
});

/**********************
 * Production tasks   *
 **********************/
gulp.task('build', ['sass', 'concat'], function build() {

});

gulp.task('default', function() {
	// place code for your default task here
});
