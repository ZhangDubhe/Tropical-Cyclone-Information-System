const gulp = require('gulp');
const del = require('del');
const url = require('url');
const proxy = require('proxy-middleware');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync');
const gulpLoadPlugins = require('gulp-load-plugins');

const $ = gulpLoadPlugins();

const reload = browserSync.reload;

const DST_DIR = 'dist/';

gulp.task('lint', () =>
    gulp.src(['src/**/*.js', '!node_modules/**'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()))
);

gulp.task('images', () =>
    gulp.src(['src/images/*.jpg', 'src/images/*.png', 'src/images/**/*.png', 'src/images/*.gif'])
    .pipe($.cache($.imagemin({
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest(DST_DIR))
    .pipe($.size({
        title: 'images'
    }))
);

gulp.task('copy', () =>
    gulp.src([
        'src/*',
        'src/**/*.min.js',
        'src/**/*.min.css',
        '!src/*.html'
    ], {
        dot: true
    }).pipe(gulp.dest(DST_DIR))
    .pipe($.size({
        title: 'copy'
    }))
);

gulp.task('styles', () => {
    const AUTOPREFIXER_BROWSERS = [
        'ie >= 10',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
    ];
    gulp.src([
            'src/**/*.scss',
            'src/**/*.css',
            '!src/**/*.min.css'
        ])
        .pipe($.newer('.tmp/styles'))
        // .pipe($.sourcemaps.init())
        .pipe($.sass({
            precision: 10
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(gulp.dest('.tmp/styles'))
        // Concatenate and minify styles
        .pipe($.if('*.css', $.cssnano()))
        .pipe($.size({
            title: 'styles'
        }))
        // .pipe($.sourcemaps.write('src/'))
        .pipe(gulp.dest(DST_DIR))
        .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('scripts', () =>
    gulp.src(['src/**/*.js', '!src/**/*.min.js', '!src/master/**', '!src/mobile/**'])
    .pipe($.newer('.tmp/scripts'))
    // .pipe($.sourcemaps.init())
    .pipe($.babel({
        presets: ['es2015']
    }))
    // .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/scripts'))
    //.pipe($.concat('main.min.js'))
    .pipe($.uglify())
    // Output files
    .pipe($.size({
        title: 'scripts'
    }))
    // .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(DST_DIR))
    .pipe(gulp.dest('.tmp/scripts'))
);

gulp.task('concat', function () {
    return gulp.src([])
        .pipe(concat('wap.min.css'))
        .pipe(minifyCss())
        .pipe(rev())
        .pipe(gulp.dest(DST_DIR))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/common'));
});

gulp.task('html', () => {
    return gulp.src(['src/**/*.html', '!src/master/**', '!src/mobile/**'])
        .pipe($.useref({
            searchPath: '{.tmp, src}',
            noAssets: true
        }))
        // Minify any HTML
        .pipe($.if('*.html', $.htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            removeOptionalTags: true,
            minifyJS: true,
            minifyCSS: true
        })))
        // Output files
        .pipe($.if('*.html', $.size({
            title: 'html',
            showFiles: true
        })))
        .pipe(gulp.dest(DST_DIR));
});

// Clean output directory
gulp.task('clean', () => del(['.tmp', DST_DIR + '*', '!' + DST_DIR + '.git', '!' + DST_DIR + 'master', '!' + DST_DIR + 'mobile'], {
    dot: true,
    force: true
}));

// Watch files for changes & reload
gulp.task('serve', ['scripts', 'styles'], () => {
    browserSync({
        open: false,
        notify: false,
        // Customize the Browsersync console logging prefix
        logPrefix: 'WSK',
        // Allow scroll syncing across breakpoints
        scrollElementMapping: ['main', '.mdl-layout'],
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: {
            baseDir: ['.tmp', 'src'],
            middleware: [proxy(mobileProxyOptions), proxy(masterProxyOptions), proxy(masterStaticProxyOptions)]
        },
        port: 80
    });

    gulp.watch(['src/**/*.html'], {
        interval: 5000
    }, reload);
    gulp.watch(['src/**/*.{scss,css}'], {
        interval: 5000
    }, ['styles', reload]);
    gulp.watch(['src/**/*.js'], {
        interval: 5000
    }, ['lint', 'scripts', reload]);
    gulp.watch(['src/**/*.jpg', 'src/**/*.png', 'src/**/*.gif'], {
        interval: 2000
    }, reload);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], () =>
    browserSync({
        notify: false,
        logPrefix: 'WSK',
        online: true,
        browser: "chrome",
        // Allow scroll syncing across breakpoints
        scrollElementMapping: ['main', '.mdl-layout'],
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: DST_DIR,
        port: 80
    })
);

// Build production files, the default task
gulp.task('default', ['clean'], cb =>
    runSequence(
        'styles', ['lint', 'html', 'scripts', 'images', 'copy'],
        //'generate-service-worker',
        cb
    )
);