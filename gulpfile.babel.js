import gulp from 'gulp'
import postcss from 'gulp-postcss'
import sass from 'gulp-sass'
import imageMin from 'gulp-imagemin'
import uglify from 'gulp-uglify'
import concat from 'gulp-concat'
import webpack from 'webpack-stream'
import named from 'vinyl-named'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

let env = process.env['NODE_ENV'] || 'production'
let isProduction = env === 'production'

gulp.task('compile 3rdparty', () => {
	const files = [
		'./node_modules/spin.js/spin.js',

		'./node_modules/babel-polyfill/dist/polyfill.min.js'
	]

	return gulp.src(files)
        .pipe(concat('libs.js'))
        .pipe(uglify())
		.pipe(gulp.dest('./public'))
})

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

gulp.task('compile', () => {
	const doWatch = !isProduction
	const doSourceMaps = !isProduction

	return gulp.src([
		'./src/public/app.js'
	])
		.pipe(named())
		.pipe(webpack({
		//	devtool: doSourceMaps ? 'inline-source-map' : null,
		//	watch: doWatch,
			output: {
				filename: '[name].js'
			},
			module: {
				loaders: [
					{test: /\.js$/, loader: 'babel'},
		//			{test: /\.html$/, loader: 'raw!html-minify'}
				]
			},
		//	'html-minify-loader': {
		//		empty: true,
		//		cdata: true,
		//		comments: false,
		//		dom: {
		//			lowerCaseAttributeNames: false
		//		}
		//	}
		}))
		.pipe(gulp.dest('./public'))
})

gulp.task('imagemin', () => {
	return gulp.src('./src/assets/graphics/**/*')
        .pipe(imageMin())
		.pipe(gulp.dest('./public/graphics'))
})

gulp.task('production', () => {
	isProduction = true
})

gulp.task('default', ['style', 'compile'])
gulp.task('copy', ['copy views', 'copy fonts', 'copy graphics', 'copy 3rdparty', 'copy robots.txt'])
gulp.task('deploy', ['default', 'copy', 'compile 3rdparty', 'imagemin'])
gulp.task('compile production', ['production', 'compile'])
