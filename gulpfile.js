var gulp = require("gulp"),
    gulp_connect = require("gulp-connect"),
    gulp_sass = require("gulp-sass"),
    gulp_sourcemaps = require("gulp-sourcemaps"),
    gulp_useref = require("gulp-useref"),
    gulp_clean = require("gulp-clean");
gulp_autoprefixer = require("gulp-autoprefixer"),
    gulp_cssnano = require("gulp-cssnano"),
    gulp_uglify = require("gulp-uglify"),
    gulp_plumber = require("gulp-plumber"),
    gulp_notify = require("gulp-notify");


// launch
gulp.task("default", ["sass", "js", "watch"], function() {
    gulp.src("./")
  .pipe(gulp_notify("Gulp is launch"));
})

// when html has an update, livereload
gulp.task('html', function() {
    gulp.src('**/**/*.html')
        .pipe(gulp_connect.reload());
});


// sass to css
gulp.task('sass', function() {

    return gulp.src('./assets/scss/main.scss')
        .pipe(gulp_plumber({
            errorHandler: gulp_notify.onError('SASS Error: <%= error.message %>')
        }))
        .pipe(gulp_sourcemaps.init())
        .pipe(gulp_sass().on('error', gulp_sass.logError))
        .pipe(gulp_sourcemaps.write())
        .pipe(gulp.dest('./assets/css'))
        .pipe(gulp_connect.reload())
        .pipe(gulp_notify('SASS compiled: <%= file.relative %>'));
});

// when js has an update, livereload
gulp.task("js", function() {
    gulp.src('./assets/scripts/**/**/*.js')
        .pipe(gulp_connect.reload());
})

// delete distribution folder
gulp.task("cleanDist", function() {

    return gulp.src('dist', {
            read: false
        })
        .pipe(gulp_clean());

})

// distribution folder where everything is minified
gulp.task("dist", ["cleanDist", "dist-concatFiles", "dist-css", "dist-js"], function() {
    gulp.src("./dist")
  .pipe(gulp_notify("Dist folder has been created"));
})

// concat all css in one, all js in one
gulp.task("dist-concatFiles", ["cleanDist"], function() {

    return gulp.src("*.html")
        .pipe(gulp_useref())
        .pipe(gulp.dest('./dist'));

})

//  autoprefix and minify our css file
gulp.task("dist-css", ["dist-concatFiles"], function() {

    return gulp.src('./dist/assets/css/style.css')
        .pipe(gulp_autoprefixer({
            browsers: ['last 6 versions'],
            cascade: false
        }))
        .pipe(gulp_cssnano())
        .pipe(gulp.dest('./dist/assets/css'));

})

// uglify our js file
gulp.task("dist-js", ["dist-concatFiles"], function() {

    return gulp.src('./dist/assets/scripts/main.js')
        .pipe(gulp_uglify())
        .pipe(gulp.dest('./dist/assets/scripts'));

})



// init sever development
gulp.task('connect', function() {
    gulp_connect.server({
        livereload: true
    });
});

// watch task
gulp.task("watch", ["connect"], function() {
    gulp.watch("./assets/scss/**/**.scss", ["sass"]);
    gulp.watch("**/**/*.html", ["html"]);
    gulp.watch("./assets/scripts/**/**.js", ["js"]);
})
