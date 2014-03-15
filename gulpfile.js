var gulp = require("gulp");
var sass = require("gulp-sass");
var minifyCSS = require("gulp-minify-css");
var autoprefixer = require("gulp-autoprefixer");
var imageMin = require("gulp-imagemin");

var pub = "./public/";

gulp.task("sass", function () {
    gulp.src("./assets/style/*.scss")
        .pipe(sass())
        .pipe(minifyCSS())
        .pipe(autoprefixer())
        .pipe(gulp.dest(pub+"s"));
});

gulp.task("copy", function(){
	gulp.src("./assets/fonts/*")
		.pipe(gulp.dest(pub+"fonts"));
});

gulp.task("imagemin", function(){
	gulp.src("./assets/img/**/*")
		.pipe(imageMin())
		.pipe(gulp.dest(pub+"img"));
});

gulp.task("default", ["sass", "copy"]);
gulp.task("deploy", ["default", "imagemin"]);