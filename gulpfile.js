var gulp = require('gulp');
// const esbuild = require('esbuild')

const sass = require('gulp-sass')(require('sass'));
const foundryPath = require("./foundry-path.js")
// const esBuildConfig = require("./esbuild.config");

gulp.task('sass', function () {
  return gulp.src('style/wrath-and-glory.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest(foundryPath.systemPath("wrath-and-glory")))
});

// gulp.task('watch', function () {
//   gulp.watch('./src/styles/*', gulp.series('sass'));
//   gulp.watch('./static/**/*', gulp.series('src'));
//   gulp.watch('./src/**/*', gulp.series('src'));
//   gulp.watch('./template.json', gulp.series('src'));
//   gulp.watch('./system.json', gulp.series('src'));
// });

// gulp.task("build", function()
// {
//   gulp.series("src", "sass", "watch")();
// })

// gulp.task("src", function (resolve) {
//   esbuild.build(esBuildConfig)
//   resolve();
// })

