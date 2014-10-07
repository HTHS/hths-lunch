var gulp = require('gulp'),
	del = require('del'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass');

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
			'!public/lib/**/*.scss',
			'public/**/*.scss'
		])
		.pipe(sass())
		.pipe(rename(function(path) {
			path.dirname = path.dirname.substring(0, path.dirname.lastIndexOf('/')) +
				'/styles';
		}))
		.pipe(gulp.dest('./public'));
});

gulp.task('build', function() {
	var jsWatcher = gulp.watch('**/*.js', {
		cwd: 'public/'
	}, ['concat']);
	jsWatcher.on('change', function(event) {
		console.log('File %s was %s, running tasks...', event.path, event.type);
	});

	var sassWatcher = gulp.watch('**/*.scss', {
		cwd: 'public/modules/'
	}, ['sass']);
	sassWatcher.on('change', function(event) {
		// event.path = event.path.replace('sass', 'styles');
		console.log('File %s was %s, running tasks...', event.path, event.type);
	});
});