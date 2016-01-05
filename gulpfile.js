var gulp = require('gulp');
var _if = require('gulp-if');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var imageMin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');

var is_production = process.env['NODE_ENV'] == 'production';

gulp.task("concat-bower", function () {
    var files = [
        "public/bower_components/jquery/dist/jquery.min.js",
        "public/bower_components/angular/angular.min.js",
        "public/bower_components/angular-route/angular-route.min.js",
        "public/bower_components/angular-animate/angular-animate.min.js",
        "public/bower_components/angulartics/dist/angulartics.min.js",
        "public/bower_components/angulartics/dist/angulartics-ga.min.js",
        "public/bower_components/spin.js/spin.js",
        "public/bower_components/angular-spinner/angular-spinner.min.js",
        "public/bower_components/socket.io-client/socket.io.js"
    ];
    gulp.src(files)
        .pipe(concat("libs.js"))
        .pipe(uglify())
        .pipe(gulp.dest("public"));
});

gulp.task('styles', function () {
    var processors = [
        require('autoprefixer')({browsers: ['last 1 version']}),
        require('cssnano')()
    ];

    gulp.src('./assets/style/*.scss')
        .pipe(sass())
        .pipe(postcss(processors))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./public'));
});

gulp.task("copy", function () {
    gulp.src("./assets/fonts/*")
        .pipe(gulp.dest("./public/fonts"));

    gulp.src("./assets/graphics/*")
        .pipe(gulp.dest("./public/graphics"));

    gulp.src([
            "./3rdparty/*",
            "robots.txt"
        ])
        .pipe(gulp.dest("./public"));
});

gulp.task('compile', function () {
    gulp.src([
            'client/app.js',
            'client/document.js',
            'client/data.js',
            'client/instagram.js'
        ])
        .pipe(browserify({
            transform: [
                require('browserify-ngannotate'),
                require('babelify')
            ]
        }))
        //.pipe(_if(is_production, minify()))
        .pipe(gulp.dest('./public'));
});

gulp.task("imagemin", function () {
    gulp.src("./assets/img/**/*")
        .pipe(imageMin())
        .pipe(gulp.dest("./public/img"));
});

gulp.task('default', ['styles', 'compile']);
gulp.task('deploy', ['default', 'copy', 'imagemin']);
