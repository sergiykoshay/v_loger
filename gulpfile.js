var gulp = require('gulp');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
//var gulpIf = require('gulp-if');
//var cssnano = require('gulp-cssnano');
//var imagemin = require('gulp-imagemin');
//var cache = require('gulp-cache');
//var del = require('del');
var runSequence = require('run-sequence');
//var livereload = require('livereload');
//var parallel = require("concurrent-transform");
//var os = require("os");
//var rename = require("gulp-rename");
//var imageResize = require('gulp-image-resize-ar');
//var resize = require('im-resize');
// Development Tasks 
// -----------------

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'build'

    }
  })
})

gulp.task('sass', function(){
  return gulp.src('assets/sass/*.scss') // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
    .pipe(gulp.dest('build/css')) // Outputs it in the css folder
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true  
    }));
})

gulp.task('pug', function(){
  return gulp.src('assets/template/**/*.pug')
    .pipe(pug({pretty:true}))
    .pipe(gulp.dest('build'))
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
});

gulp.task('js',function(){
  return gulp.src('assets/js/**/*.js')
  .pipe(gulp.dest('build/js'))
  .pipe(browserSync.reload({
    stream: true
  }));
});
// Watchers
gulp.task('watch', function() {
  gulp.watch('assets/sass/**/*.scss', ['sass']);
  gulp.watch('assets/template/**/*.pug', ['pug']);
  gulp.watch('assets/js/**/*.js', ['js']);
})

// Optimization Tasks 
// ------------------

// Optimizing CSS and JavaScript 
gulp.task('useref', function() {

  return gulp.src('assets/template/*.pug')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

// Optimizing Images 
gulp.task('images', function() {
  return gulp.src('assets/images/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(gulp.dest('build/images'))
});

// Copying fonts 
gulp.task('fonts', function() {
  return gulp.src('assets/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})

// Cleaning 
gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
})

gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

// Build Sequences
// ---------------

gulp.task('default', function(callback) {
  runSequence(['sass', 'pug', 'browserSync'], 'watch',
    callback
  )
});

gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    'sass',
    ['useref', 'images', 'fonts'],
    callback
  )
});
