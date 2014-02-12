var gulp = require("gulp");
var sass = require("gulp-sass");
var minifyCSS = require("gulp-minify-css");

var pub = "~/Dropbox/Dev/Hud school/public/";

var list = [];
task("sass", function () {
    gulp.src("./view/*.scss")
        .pipe(sass())
        .pipe(minifyCSS())
        .pipe(gulp.dest(pub+"s"));
});

function task(name, f){
	list.push(name);
	gulp.task(name, f);
}

gulp.task("default", list);