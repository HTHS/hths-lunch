var gulp = require('gulp'),
	del = require('del'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	mocha = require('gulp-mocha'),
	istanbul = require('gulp-istanbul');

/**
 * Helpers
 */
gulp.task('env:test', function() {
	process.env.NODE_ENV = 'test';
});

gulp.task('default', function() {
	// place code for your default task here
});

gulp.task('concat', function() {
	del.sync('public/app.js');

	return gulp.src([
			'public/lib/jquery/dist/jquery.min.js',
			'public/lib/angular/angular.min.js',
			'public/lib/angular-ui-router/release/angular-ui-router.min.js',
			'public/lib/angular-resource/angular-resource.min.js',
			'public/lib/foundation/js/vendor/modernizr.js',
			'public/lib/foundation/js/foundation.min.js',
			'public/modules/**/*.js'
		])
		.pipe(concat('app.js'))
		.pipe(gulp.dest('public/'));
});

gulp.task('sass', function() {
	gulp.src([
			'public/sass/**/*.scss'
		])
		.pipe(sass())
		.pipe(gulp.dest('public/styles'));

	gulp.src([
			'public/modules/**/*.scss'
		])
		.pipe(sass())
		.pipe(rename(function(path) {
			path.dirname = path.dirname.replace('sass', 'styles');
		}))
		.pipe(gulp.dest('public/modules/'));
});

gulp.task('watch', function() {
	var jsWatcher = gulp.watch('**/*.js', {
		cwd: 'public/'
	}, ['concat']);
	jsWatcher.on('change', function(event) {
		console.log('File %s was %s, running tasks...', event.path, event.type);
	});

	var sassWatcher = gulp.watch('**/*.scss', {
		cwd: 'public/'
	}, ['sass']);
	sassWatcher.on('change', function(event) {
		// event.path = event.path.replace('sass', 'styles');
		console.log('File %s was %s, running tasks...', event.path, event.type);
	});
});

gulp.task('mocha', ['env:test'], function() {
	var mongoose = require('./config/mongoose');


	gulp.src(['app/**/*.js', 'config/**/*.js', 'public/modules/**/*.js'])
		.pipe(istanbul())
		.on('finish', function() {

			mongoose
				.connect()
				.then(function(db) {
					return gulp.src('./test/**/*.js')
						.pipe(mocha({
							// reporter: 'mocha-lcov-reporter'
						}))
						.pipe(istanbul.writeReports())
						.once('end', function() {
							mongoose.disconnect();

							// var exec = require('child_process').exec;
							//
							// var child = exec('', function(err, stdout, stderr) {
							// 	if (err) {
							// 		console.log(err);
							// 	}
							//
							// 	if (stdout) {
							// 		console.log(stdout);
							// 	}
							//
							// 	if (stderr) {
							// 		console.log(stderr);
							// 	}
							// });
						});

				});
		});
});

gulp.task('test', ['mocha'], function() {

});

gulp.task('build', ['sass', 'concat'], function() {

});
