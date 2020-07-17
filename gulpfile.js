'use strict';
const gulp = require('gulp');
const sass = require('gulp-sass');
const rimraf = require('rimraf');
const browserSync = require('browser-sync');
const watch = require('gulp-watch');
const htmlreplace = require('gulp-html-replace');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const htmlminify = require('gulp-html-minify-edit');
const mode = require('gulp-mode')();

sass.compiler = require('node-sass');

const config = {
  server: {
    baseDir: './build',
  },
  host: 'localhost',
  port: 9000,
  watch: true,
};

const path = {
  build: {
    html: 'build/',
    css: 'build/assets/style/',
    img: 'build/assets/img/',
    fonts: 'build/assets/fonts/',
  },
  src: {
    html: './src/*.html',
    scss: './src/assets/style/scss/*.scss',
    scssStyle: './src/assets/style/scss/style.scss',
    img: './src/assets/img/*.*',
    fonts: './src/assets/fonts/*.*',
  },
  clean: './build',
};

gulp.task('sass', () => {
  return gulp.src(path.src.scssStyle)
    .pipe(sass().on('error', sass.logError))
    .pipe(mode.development(sourcemaps.init()))
    .pipe(autoprefixer())
    .pipe(mode.production(cleanCSS()))
    .pipe(mode.development(sourcemaps.write()))
    .pipe(gulp.dest(path.build.css));
});
 
gulp.task('img', () => {
  return gulp
    .src(path.src.img)
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(gulp.dest(path.build.img));
});

gulp.task('fonts', () => {
  return gulp.src(path.src.fonts).pipe(gulp.dest(path.build.fonts));
});

gulp.task('html', () => {
  return gulp
    .src(path.src.html)
    .pipe(
      htmlreplace({
        css: './assets/style/style.css',
      })
  )
  .pipe(mode.production(htmlminify()))
    .pipe(gulp.dest(path.build.html));
});

gulp.task(
  'build',
  gulp.series([
    'sass',
    'img',
    'html',
    'fonts'
  ])
);

gulp.task('webserver', () => {
  browserSync(config);
});

gulp.task('watch', () => {
  watch(path.src.html, gulp.parallel('html'));
  watch(path.src.scss, gulp.parallel('sass'));
});

gulp.task('start', gulp.parallel('build', 'webserver', 'watch'));

gulp.task('clean', (cb) => {
  rimraf(path.clean, cb);
});
