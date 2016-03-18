import gulp from 'gulp';
import postcss from 'gulp-postcss';
import sass from 'gulp-sass';
import imageMin from 'gulp-imagemin';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import webpack from 'webpack-stream';
import named from 'vinyl-named';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import ngAnnotate from 'gulp-ng-annotate';
import $if from 'gulp-if';

let isProduction = process.env['NODE_ENV'] === 'production';

gulp.task('concat-bower', () => {
    const files = [
        './bower_components/jquery/dist/jquery.min.js',
        './bower_components/angular/angular.min.js',
        './bower_components/angular-route/angular-route.min.js',
        './bower_components/angulartics/dist/angulartics.min.js',
        './bower_components/angulartics/dist/angulartics-ga.min.js',
        './bower_components/spin.js/spin.js',
        './bower_components/angular-spinner/angular-spinner.min.js',
        './bower_components/socket.io-client/socket.io.js'
    ];

    return gulp.src(files)
        .pipe(concat('libs.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public'));
});

gulp.task('styles', () => {
    const processors = [
        autoprefixer({
            browsers: ['last 1 version']
        }),
        cssnano({
            zindex: false
        })
    ];

    return gulp.src('./src/style/style.scss')
        .pipe(sass())
        .pipe(postcss(processors))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./public'));
});

gulp.task('copy fonts', () => {
    return gulp.src('./src/assets/fonts/*/*')
        .pipe(gulp.dest('./public/fonts'));
});

gulp.task('copy graphics', () => {
    return gulp.src('./src/assets/graphics/*')
        .pipe(gulp.dest('./public/graphics'));
});

gulp.task('copy 3rdparty', () => {
    return gulp.src('./src/3rdparty/*')
        .pipe(gulp.dest('./public'));
});

gulp.task('copy robots.txt', () => {
    return gulp.src('./robots.txt')
        .pipe(gulp.dest('./public'));
});

gulp.task('compile', () => {
    gulp.src([
            './src/client/app.js',
            './src/client/instagram.js'
        ])
        .pipe(named())
        .pipe(webpack({
            // devtool: 'inline-source-map',
            output: {
                filename: '[name].js'
            },
            module: {
                loaders: [
                    {test: /\.js$/, loader: 'babel'},
                    {test: /\.html$/, loader: 'raw!html-minify'}
                ]
            },
            'html-minify-loader': {
                empty: true,
                cdata: true,
                comments: false,
                dom: {
                    lowerCaseAttributeNames: false
                }
            }
        }))
        // .pipe($if(isProduction, ngAnnotate()))
        // .pipe($if(isProduction, uglify()))
        .pipe(gulp.dest('./public'));
});

gulp.task('imagemin', () => {
    return gulp.src('./src/assets/graphics/**/*')
        .pipe(imageMin())
        .pipe(gulp.dest('./public/graphics'));
});

gulp.task('production', () => {
    isProduction = true;
});

gulp.task('default', ['styles', 'compile']);
gulp.task('copy', ['copy fonts', 'copy graphics', 'copy 3rdparty', 'copy robots.txt']);
gulp.task('deploy', ['default', 'copy', 'imagemin']);
gulp.task('compile production', ['production', 'compile']);
