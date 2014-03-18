var path = require("path");
var gulp = require("gulp");
var sass = require("gulp-sass");
var minifyCSS = require("gulp-minify-css");
var autoprefixer = require("gulp-autoprefixer");
var imageMin = require("gulp-imagemin");
var uglify = require("gulp-uglify");

var pub = "./public/";

gulp.task("sass", function () {
    gulp.src("./assets/style/*.scss")
        .pipe(sass())
        .pipe(minifyCSS())
        .pipe(autoprefixer())
        .pipe(gulp.dest("./public/s"));
});

gulp.task("copy", function(){
	gulp.src("./assets/fonts/*")
		.pipe(gulp.dest("./public/fonts"));

	gulp.src("./assets/style/*.css")
		.pipe(gulp.dest("./public/s"));
});

gulp.task("uglify", function(){
	gulp.src("./client/*.js")
		.pipe(uglify())
		.pipe(gulp.dest("./public/c"));
});

gulp.task("imagemin", function(){
	gulp.src("./assets/img/**/*")
		.pipe(imageMin())
		.pipe(gulp.dest("./public/img"));
});

gulp.task("default", ["sass", "copy", "uglify"]);
gulp.task("deploy", ["default", "imagemin"]);