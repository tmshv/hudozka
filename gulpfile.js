const gulp = require('gulp')
const postcss = require('gulp-postcss')
const sass = require('gulp-sass')
const imageMin = require('gulp-imagemin')
const concat = require('gulp-concat')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

gulp.task('style', () => {
	const processors = [
		autoprefixer({
			browsers: ['last 1 version']
		}),
		cssnano({
			zindex: false
		})
	]

	return gulp.src('./src/style/style.scss')
        .pipe(sass())
        .pipe(postcss(processors))
        .pipe(concat('style.css'))
		.pipe(gulp.dest('./public'))
})

gulp.task('copy fonts', () => {
	return gulp.src('./src/assets/fonts/*/*')
		.pipe(gulp.dest('./public/fonts'))
})

gulp.task('copy graphics', () => {
	return gulp.src('./src/assets/graphics/*')
		.pipe(gulp.dest('./public/graphics'))
})

gulp.task('copy 3rdparty', () => {
	return gulp.src('./src/3rdparty/*')
		.pipe(gulp.dest('./public'))
})

gulp.task('copy robots.txt', () => {
	return gulp.src('./robots.txt')
		.pipe(gulp.dest('./public'))
})

gulp.task('copy views', () => {
	return gulp.src('./src/views/**')
		.pipe(gulp.dest('./out/views'))
})

gulp.task('imagemin', () => {
	return gulp.src('./src/assets/graphics/**/*')
        .pipe(imageMin())
		.pipe(gulp.dest('./public/graphics'))
})

gulp.task('copy', gulp.series('copy views', 'copy fonts', 'copy graphics', 'copy robots.txt', 'copy 3rdparty'))
gulp.task('default', gulp.series('style', 'copy', 'imagemin'))
