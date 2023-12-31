const gulp = require('gulp');

const clean = require('gulp-clean');
const fs = require('fs');

const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');

const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const changed = require('gulp-changed');
const sourceMaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

gulp.task('clean:dev', function (done) {
	if (fs.existsSync('./build/')) {
		return gulp
			.src('./build/', { read: false })
			.pipe(clean({ force: true }));
	}
	done();
});

const plumberNotify = (title) => {
	return {
		errorHandler: notify.onError({
			title: title,
			message: 'Error <%= error.message %>',
			sound: false,
		}),
	};
};

gulp.task('html:dev', function () {
	return (
		gulp
			.src(['./src/index.html',])
			.pipe(changed('./build/'))
			.pipe(plumber(plumberNotify('HTML')))
			.pipe(gulp.dest('./build/'))
			.pipe(reload({ stream: true }))
	);
});

gulp.task('sass:dev', function () {
	return (
		gulp
			.src('./src/scss/*.scss')
			.pipe(changed('./build/css/'))
			.pipe(plumber(plumberNotify('SCSS')))
			.pipe(sourceMaps.init())
			.pipe(sassGlob())
			.pipe(sass())
			.pipe(sourceMaps.write())
			.pipe(gulp.dest('./build/css/'))
			.pipe(reload({ stream: true }))
	);
});


gulp.task('images:dev', function () {
	return gulp
		.src('./src/assets/images/**/*')
		.pipe(changed('./build/images/'))
		.pipe(gulp.dest('./build/images/'))
		.pipe(reload({ stream: true }))
});

gulp.task('fonts:dev', function () {
	return gulp
		.src('./src/assets/fonts/**/*')
		.pipe(changed('./build/fonts/'))
		.pipe(gulp.dest('./build/fonts/'))
		.pipe(reload({ stream: true }))
});

gulp.task('browser-sync', function () {
	browserSync.init({
		server: {
			baseDir: './build/',
		},
	});
});

gulp.task('watch:dev', function () {
	gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'));
	gulp.watch('./src/index.html', gulp.parallel('html:dev'));
	gulp.watch('./src/img/**/*', gulp.parallel('images:dev'));
	gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:dev'));
});
