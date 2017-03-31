const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const clean = require('gulp-clean');
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();

const clientRoot = "./src/",
    jsFiles = [`${clientRoot}/**/*.jsx`, `${clientRoot}/**/*.js`],
    jsMain = `${clientRoot}/index.jsx`,
    scssFiles = `${clientRoot}/**/*.scss`,
    scssMain = `${clientRoot}/styles/main.scss`,
    staticFiles = `${clientRoot}/index.html`

gulp.task('default', ['build']);

gulp.task('clean', () => {
    gulp.src('./wwwroot', { read: false })
        .pipe(clean());
});

gulp.task('build', ['compilejs', 'compilesass', 'copyStaticFiles']);

gulp.task('serve', ['build'], () => {
        browserSync.init({
        open: true,
        logLevel: 'silent',
        server: {
            baseDir: './wwwroot'
        }
    }, (err, bs) => {
        let urls = bs.options.get('urls').toJS();
        console.log(`Application Available At: ${urls.local}`);
        console.log(`BrowserSync Available At: ${urls.ui}`);
    });

    watch(jsFiles, () => { gulp.start(['compilejs']); });
    watch(scssFiles, () => { gulp.start(['compilesass']); });
    watch(staticFiles, () => { gulp.start(['copyStaticFiles']); }).on('change', browserSync.reload);
});

gulp.task("compilejs", () => {
    return browserify({
        entries: [jsMain],
        debug: true,
        extensions: [".js", ".jsx"]
    })
        .transform("babelify")
        .bundle()
        .pipe(source('./bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./wwwroot'))
        .pipe(browserSync.stream());
});

gulp.task("compilesass", () => {
    return gulp.src([scssMain])
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(sass().on('error', () => sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./wwwroot'))
        .pipe(browserSync.stream());
});

gulp.task('copyStaticFiles', () => {
    gulp.src(staticFiles)
        .pipe(gulp.dest('./wwwroot'));
});