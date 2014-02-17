var gulp = require("gulp");
var sass = require("gulp-sass");
var minifyCSS = require("gulp-minify-css");
var imageMin = require("gulp-imagemin");

// var pub = "~/Dropbox/Dev/Hud school/public/";
var pub = "./public/";

gulp.task("sass", function () {
    gulp.src("./view/*.scss")
        .pipe(sass())
        // .pipe(minifyCSS())
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

gulp.task("compile", ["sass", "copy"]);
gulp.task("default", ["compile", "imagemin"]);