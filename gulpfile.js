var gulp = require("gulp");
var sass = require("gulp-sass");
var minifyCSS = require("gulp-minify-css");
var imageMin = require("gulp-imagemin");

// var pub = "~/Dropbox/Dev/Hud school/public/";
var pub = "./public/";

var list = [];
task("sass", function () {
    gulp.src("./view/*.scss")
        .pipe(sass())
        .pipe(minifyCSS())
        .pipe(gulp.dest(pub+"s"));
});

task("imagemin", function(){
	gulp.src("./assets/img/**/*")
		.pipe(imageMin())
		.pipe(gulp.dest(pub+"img"));
});

task("copy", function(){
	gulp.src("./assets/fonts/*")
		.pipe(gulp.dest(pub+"fonts"));
});

function task(name, f){
	list.push(name);
	gulp.task(name, f);
}

gulp.task("default", list);