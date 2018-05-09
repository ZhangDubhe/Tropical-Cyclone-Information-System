var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-clean-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');

gulp.task('default', function () {
    // place code for your default task here

});
// 检验styles 
gulp.task('styles', function () {
    return gulp.src('src/styles/main.scss')
        .pipe(sass({
            style: 'expanded'
        }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cleancss())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(notify({
            message: 'Styles task complete'
        }));
});
// 检验js
gulp.task('scripts', function () {
    return gulp.src('src/scripts/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});
// 压缩图片
gulp.task('images', function () {
    return gulp.src('src/images/**/*')
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/assets/img'))
        .pipe(notify({
            message: 'Images task complete'
        }));
});