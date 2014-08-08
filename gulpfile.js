'use strict';
// generated on 2014-06-24 using generator-gulp-webapp 0.1.0

var src_dir = 'app',
    dest_dir = 'dist';


var gulp = require('gulp');

// load plugins
var $ = require('gulp-load-plugins')(),
    browserSync = require('browser-sync'),
    gutil       = require('gulp-util'),
    fileinclude = require('gulp-file-include'),
    svgSprite   = require('gulp-svg-sprites'),
    reload      = browserSync.reload;

gulp.task('styles', function () {
    return gulp.src(src_dir + '/styles/main.scss')
        .pipe($.plumber(function (error) {
            gutil.beep();
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
        .pipe($.rubySass({
            lineNumbers: true,
            style: 'expanded', //compact, compressed
            precision: 10
        }))
        .pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe(gulp.dest(dest_dir + '/styles'))
        .pipe(browserSync.reload({ stream: true }))
        .pipe($.size());
});

gulp.task('scripts', function () {
    return gulp.src(src_dir + '/scripts/main.js') ///scripts/**/*.js
        .pipe($.plumber(function (error) {
            gutil.beep();
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.jshint.reporter('fail'))
        .pipe(gulp.dest(dest_dir + '/scripts'))
        .pipe($.size())
});

gulp.task('fileinclude', function() {
    return gulp.src([src_dir + '/templates/*.html'])
        .pipe($.plumber(function (error) {
            gutil.beep();
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
        .pipe(fileinclude({
          prefix: '@@',
          basepath: '@file'
        }))
        .pipe(gulp.dest(src_dir))
        .pipe(gulp.dest(dest_dir))
        .pipe(browserSync.reload({ stream: true }))
        .pipe($.size());
});

gulp.task('html', ['styles', 'scripts'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');

    return gulp.src(src_dir + '/*.html')
        .pipe($.useref.assets({ searchPath: '{.tmp,app}' }))
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest(dest_dir))
        .pipe(browserSync.reload({ stream: true }))
        .pipe($.size());
});


gulp.task('svg2png', function () {
    return gulp.src(src_dir + '/images/**/*.svg')  
        .pipe($.raster({format: 'png'}))
        .pipe($.rename({extname: '.png'}))
        .pipe(gulp.dest(src_dir + '/images'))
        .pipe(gulp.dest(dest_dir + '/images'))
        .pipe($.size());     
});

gulp.task('sprite', ['svg2png'], function () {
    return gulp.src(src_dir + '/images/*.svg')
        .pipe(svgSprite())
        .pipe(gulp.dest(src_dir + '/images/sprite')) // Write the sprite-sheet + CSS + Preview
        .pipe($.filter('**/*.svg'))  // Filter out everything except the SVG file
        .pipe($.svg2png())           // Create a PNG
        .pipe(gulp.dest(src_dir + '/images/sprite'))
        .pipe(gulp.dest(dest_dir + '/images/sprite'));
});


gulp.task('images', ['sprite'], function () {
    return gulp.src(src_dir + '/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(dest_dir + '/images'))
        .pipe($.size());
});

gulp.task('fonts', function () {
    return $.bowerFiles()
        .pipe($.filter(src_dir + '/**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest(dest_dir + '/fonts'))
        .pipe($.size());
});

gulp.task('extras', function () {
    return gulp.src([src_dir + '/*.*', '!app/**/*.html'], { dot: true })
        .pipe(gulp.dest(dest_dir));
});

gulp.task('clean', function () {
    return gulp.src(['.tmp', dest_dir], { read: false }).pipe($.clean());
});

gulp.task('build', ['fileinclude', 'images', 'styles', 'scripts', 'fonts', 'extras']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('serve', ['styles'], function () {
    browserSync.init({
        server: {
            baseDir: [src_dir, '.tmp']
        },
        notify: false
    });
});

// inject bower components
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    gulp.src(src_dir + '/styles/**/*.scss')
        .pipe(wiredep({
            directory: src_dir + '/bower_components'
        }))
        .pipe(gulp.dest(src_dir + '/styles'))
        .pipe(gulp.dest(dest_dir + '/styles'));

    gulp.src(src_dir + '/scripts/**/*.js')
        .pipe(wiredep({
            directory: src_dir + '/bower_components'
        })).pipe(gulp.dest(dest_dir + '/scripts'));

    gulp.src(src_dir + '*.html')
        .pipe(wiredep({
            directory: src_dir + '/bower_components',
            exclude: ['bootstrap-sass-official']
        }))
        .pipe(gulp.dest(dest_dir));
});

gulp.task('watch', ['serve'], function () {
    var server = $.livereload();
    var files = [
        src_dir + '/templates/**/*.html',
        '.tmp/styles/**/*.css',
        src_dir + '/scripts/**/*.js',
        src_dir + '/images/**/*'
    ];

    // watch for changes
    gulp.watch(files).on('change', function (file) {
        server.changed(file.path);
    });
    gulp.watch(src_dir + '/templates/**/*.html', ['fileinclude']);
    gulp.watch(src_dir + '/styles/**/*.scss', ['styles']);
    gulp.watch(src_dir + '/scripts/**/*.js', ['scripts']);
    gulp.watch(src_dir + '/images/**/*', ['images']);
    gulp.watch('bower.json', ['wiredep']);
});

