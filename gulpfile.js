var path = require("path");
var gulp = require("gulp");
var sass = require("gulp-sass");
var minifyCSS = require("gulp-minify-css");
var autoprefixer = require("gulp-autoprefixer");
var imageMin = require("gulp-imagemin");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var browserify = require("gulp-browserify");

gulp.task("sass", function () {
    gulp.src("./assets/style/*.scss")
        .pipe(sass())
		.pipe(concat("style.css"))
		.pipe(autoprefixer())
        //.pipe(minifyCSS({processImport:false}))
        .pipe(gulp.dest("public"));
});

gulp.task("copy", function(){
	gulp.src("./assets/fonts/*")
		.pipe(gulp.dest("./public/fonts"));

	gulp.src("./assets/style/*.css")
		.pipe(gulp.dest("./public/s"));

	gulp.src("./assets/graphics/*")
		.pipe(gulp.dest("./public/graphics"));
});

gulp.task("compile", function(){
	gulp.src("client/app.js")
		.pipe(browserify())
		.pipe(gulp.dest("public"));

	gulp.src("client/document.js")
		.pipe(browserify())
		.pipe(gulp.dest("public"));

	gulp.src("client/data.js")
		.pipe(browserify())
		.pipe(gulp.dest("public"));
});

gulp.task("imagemin", function(){
	gulp.src("./assets/img/**/*")
		.pipe(imageMin())
		.pipe(gulp.dest("./public/img"));
});

gulp.task("default", ["sass", "compile"]);
gulp.task("deploy", ["default", "copy", "imagemin"]);
