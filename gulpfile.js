var gulp = require("gulp");
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');


function style() {
    return gulp.src('app/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error',sass.logError))
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream());
}

function scripts(){
    return gulp.src(['node_modules/babel-polyfill/dist/polyfill.js', 'app/js/index.js'])
    .pipe(babel({
        presets: [['env', 'es2015']]
    }))
    .pipe(gulp.dest('app/js/es5'))
    .pipe(browserSync.stream());
}


function watch() {
    browserSync.init({
        server: {
           index: "index.html"
        }
    });
    gulp.watch('app/scss/**/*.scss', style);
    gulp.watch('app/js/index.js', scripts);
    gulp.watch('*.html').on('change',browserSync.reload);
}

exports.scripts = scripts;
exports.style = style;
exports.watch = watch;
