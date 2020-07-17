'use strict';
const gulp = require('gulp');
const sass = require('gulp-sass');
const rimraf = require('rimraf');
const browserSync = require('browser-sync');
const watch = require('gulp-watch');
const htmlreplace = require('gulp-html-replace');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
// const imagemin = require('gulp-imagemin');
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
    webfonts: 'build/assets/webfonts/',
  },
  src: {
    html: './src/*.html',
    scss: './src/assets/style/scss/style.scss',
    img: './src/assets/img/**/*.*',
    webfonts: './src/assets/webfonts/*.*',
  },
  clean: './build',
};

gulp.task('sass', () => {
  return gulp.src(path.src.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(mode.development(sourcemaps.init()))
    .pipe(autoprefixer())
    .pipe(mode.production(cleanCSS()))
    .pipe(mode.development(sourcemaps.write()))
    .pipe(gulp.dest(path.build.css));
});
 
gulp.task('sass:watch', () => {
  gulp.watch(path.src.scss, ['sass']);
});

// gulp.task('img:min', () => {
//   return gulp
//     .src(path.src.img)
//     .pipe(
//       imagemin([
//         imagemin.gifsicle({ interlaced: true }),
//         imagemin.mozjpeg({ quality: 75, progressive: true }),
//         imagemin.optipng({ optimizationLevel: 5 }),
//         imagemin.svgo({
//           plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
//         }),
//       ])
//     )
//     .pipe(gulp.dest(path.build.img));
// });

// gulp.task('webfonts:build', () => {
//   return gulp.src(path.src.webfonts).pipe(gulp.dest(path.build.webfonts));
// });

gulp.task('html:build', () => {
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
    'html:build',
  ])
);

gulp.task('webserver', () => {
  browserSync(config);
});

gulp.task('watch', () => {
  watch(path.src.html, gulp.parallel('html:build'));
  watch(path.src.scss, gulp.parallel('sass'));
});

gulp.task('start', gulp.parallel('build', 'webserver', 'watch'));

gulp.task('clean', (cb) => {
  rimraf(path.clean, cb);
});
