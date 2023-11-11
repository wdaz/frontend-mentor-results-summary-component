const gulp = require('gulp');
const clean = require('gulp-clean');
const fs = require('fs');

// HTML
const htmlclean = require('gulp-htmlclean');
const webpHTML = require('gulp-webp-html');

// SCSS
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const webpCss = require('gulp-webp-css');

// Images
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');

// Server
const server = require('gulp-server-livereload');

const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const changed = require('gulp-changed');
const sourceMaps = require('gulp-sourcemaps');
const groupMedia = require('gulp-group-css-media-queries');

gulp.task('clean:docs', function (done) {
    if (fs.existsSync('./docs/')) {
        return gulp
            .src('./docs/', { read: false })
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

gulp.task('html:docs', function () {
    return (
        gulp
            .src(['./src/index.html',])
            .pipe(changed('./docs/'))
            .pipe(plumber(plumberNotify('HTML')))
            .pipe(webpHTML())
            .pipe(htmlclean())
            .pipe(gulp.dest('./docs/'))
    );
});

gulp.task('sass:docs', function () {
	return (
		gulp
			.src('./src/scss/*.scss')
			.pipe(changed('./docs/css/'))
			.pipe(plumber(plumberNotify('SCSS')))
			.pipe(sourceMaps.init())
            .pipe(autoprefixer())
			.pipe(sassGlob())
            .pipe(webpCss())
            .pipe(groupMedia())
			.pipe(sass())
            .pipe(csso())
			.pipe(sourceMaps.write())
			.pipe(gulp.dest('./docs/css/'))
	);
});


gulp.task('images:docs', function () {
	return gulp
		.src('./src/assets/images/**/*')
		.pipe(changed('./docs/images/'))
        .pipe(webp())
        .pipe(gulp.dest('./docs/images/'))
		.pipe(gulp.src('./src/images/**/*'))
		.pipe(changed('./docs/images/'))
		.pipe(imagemin({ verbose: true }))
		.pipe(gulp.dest('./docs/images/'));
});

gulp.task('fonts:docs', function () {
	return gulp
		.src('./src/assets/fonts/**/*')
		.pipe(changed('./docs/fonts/'))
		.pipe(gulp.dest('./docs/fonts/'));
});

const serverOptions = {
	livereload: true,
	open: true,
};

gulp.task('server:docs', function () {
	return gulp.src('./docs/').pipe(server(serverOptions));
});
