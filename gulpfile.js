/*eslint env node*/

const gulp = require('gulp');
const pug = require('gulp-pug');
const stylus = require('gulp-stylus');
const sourcemaps = require('gulp-sourcemaps');
const rupture = require('rupture');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const webpack = require('webpack-stream');
const eslint = require('gulp-eslint');
const csso = require('gulp-csso');
const prefix = require('gulp-autoprefixer');
const imagemin = require('imagemin-pngquant');
const del = require('del');
const browserSync = require('browser-sync');

const reload = browserSync.reload;

const path = {
  build: {
    html: 'dist',
    css: 'dist/css/',
    js: 'dist/js',
    img: 'dist/img',
    fonts: 'dist/fonts/',
  },
  src: {
    pug: 'app/pug/*.pug',
    styles: 'app/styl/*.styl',
    js: 'app/js/*.js',
    img: 'app/img/**/*.*',
    fonts: 'app/fonts/**/*.*',
  },
  watch: {
    pug: 'app/pug/**/*.pug',
    js: 'app/js/**/*.js',
    styles: 'app/styl/**/*.styl',
    img: 'app/img/**/*.*',
    fonts: 'app/fonts/**/*.*',
  },
};

gulp.task('server', () => {
  browserSync({
    server: {
      baseDir: 'dist',
    },
    notify: false,
  });
});

gulp.task('clean', () => del.sync('dist'));

gulp.task('lint', () => gulp.src(path.src.js)
  .pipe(eslint({
    fix: true,
  }))
  .pipe(eslint.format())
  .pipe(eslint.failAfterError()));

gulp.task('html:build', () => gulp.src(path.src.pug)
  .pipe(pug({ pretty: true }))
  .pipe(gulp.dest(path.build.html))
  .pipe(reload({ stream: true })));

// Compiles Stylus to CSS
// Adds prefixes
gulp.task('styles:build', () => gulp.src(path.src.styles)
  .pipe(sourcemaps.init())
  .pipe(stylus({
    sourcemaps: true,
    use: [rupture()],
  }))
  .pipe(sourcemaps.write())
  .pipe(prefix({ browsers: ['last 2 versions'] }))
  .pipe(gulp.dest(path.build.css))
  .pipe(reload({ stream: true })));

gulp.task('js:build', () => gulp.src(path.src.js)
  .pipe(babel())
  .pipe(webpack({
    output: {
      filename: 'main.js',
    },
  }))
  .pipe(gulp.dest(path.build.js))
  .pipe(reload({ stream: true })));

gulp.task('image:build', () => gulp.src(path.src.img)
  // .pipe(imagemin({
  //     progressive: true,
  //     svgoPlugins: [{removeViewBox: false}],
  //     interlaced: true,
  //     options: {
  //         cache: true
  //     }
  // }))
  .pipe(gulp.dest(path.build.img)));

gulp.task('fonts:build', () => gulp.src(path.src.fonts)
  .pipe(gulp.dest(path.build.fonts)));

gulp.task('build', [
  'html:build',
  'styles:build',
  'js:build',
  'fonts:build',
  'image:build',
]);

gulp.task('watch', () => {
  gulp.watch(path.watch.pug, ['html:build']);
  gulp.watch(path.watch.styles, ['styles:build']);
  gulp.watch(path.watch.js, ['js:build']);
  gulp.watch(path.watch.img, ['image:build']);
  gulp.watch(path.watch.fonts, ['fonts:build']);
});

gulp.task('default', ['build', 'server', 'watch']);
