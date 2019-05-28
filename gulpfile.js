'use strict';

var gulp         = require('gulp');
var sass         = require('gulp-sass');
var del          = require('del');
var sourcemaps   = require('gulp-sourcemaps');
var plumber      = require('gulp-plumber');
var fileinclude  = require('gulp-file-include');
var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync').create();


var path         = {
    html         : 'src/*.html',
    htminc       : 'src/_inc/**/*.htm',
    incdir       : 'src/_inc/',
    plugins      : 'src/assets/plugins/**/*.*',
    js           : 'src/assets/js/*.js',
    scss         : 'src/assets/scss/**/*.scss',
    img          : 'src/assets/img/**/*.+(png|jpg|gif)',
    bootstrap    : 'node_modules/bootstrap/dist/**/*.*',
    jquery       : 'node_modules/jquery/dist/**/*.*'
};

var dist         = 'dist/'

var assets       = dist + 'assets/';

var port         = 8080;


/* =====================================================
    CLEAN
    ===================================================== */

gulp.task('clean', function() {
  return del( dist )
});


/* =====================================================
    HTML
    ===================================================== */

gulp.task('html', function() {
  return gulp.src( path.html )
    .pipe(plumber())
    .pipe(fileinclude({ basepath: path.incdir }))
    .pipe(gulp.dest(dist))
    .pipe(browserSync.stream())
});


/* =====================================================
    CSS
    ===================================================== */

gulp.task('scss', function() {
  return gulp.src( path.scss )
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(assets + 'css/'))
    .pipe(browserSync.stream())
});


/* =====================================================
    JS
    ===================================================== */

gulp.task('js', function() {
  return gulp.src( path.js )
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(assets + 'js/'))
    .pipe(browserSync.stream())
});


/* =====================================================
    IMAGE
    ===================================================== */

gulp.task('img', function() {
  return gulp.src( path.img )
    .pipe(plumber())
    .pipe(gulp.dest(assets + 'img/'))
    .pipe(browserSync.stream())
});


/* =====================================================
    PLUGINS
    ===================================================== */

gulp.task('bootstrap', function() {
  return gulp.src( path.bootstrap )
    .pipe(plumber())
    .pipe(gulp.dest(assets + 'plugins/bootstrap/'))
});

gulp.task('jquery', function() {
  return gulp.src( path.jquery )
    .pipe(plumber())
    .pipe(gulp.dest(assets + 'plugins/jquery/'))
});

gulp.task('plugins', gulp.series('bootstrap', 'jquery', function() {
  return gulp.src( path.plugins )
    .pipe(plumber())
    .pipe(gulp.dest(assets + 'plugins/'))
}));


/* =====================================================
    WATCH
    ===================================================== */

gulp.task('watch', gulp.series('html', 'scss', 'js', 'img', 'plugins', function() {
  gulp.watch( path.html, gulp.series('html')).on('change', browserSync.reload)
  gulp.watch( path.htminc, gulp.series('html')).on('change', browserSync.reload)
  gulp.watch( path.scss, gulp.series('scss')).on('change', browserSync.reload)
  gulp.watch( path.js, gulp.series('js')).on('change', browserSync.reload)
  gulp.watch( path.img, gulp.series('img')).on('change', browserSync.reload)
  browserSync.init({
    server: {
      baseDir: dist
    },
    port: port
  })
}));


/* =====================================================
    Build
    ===================================================== */

gulp.task('build', gulp.series('clean', 'html', 'scss', 'js', 'img', 'plugins', function() {
  return gulp.src( [assets, path.scss] )
    .pipe(plumber())
    .pipe(gulp.dest( dist + 'scss/' ))
}));


/* =====================================================
    DEFAULT
    ===================================================== */

gulp.task('default', gulp.series('clean','watch'));
