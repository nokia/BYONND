/* Dependencies */
var gulp = require("gulp"),
    runSequence = require("run-sequence"),
    del = require("del"),
    ts = require('gulp-typescript'),
    concat = require('gulp-concat'),
    replace = require('gulp-replace'),
    replaceRegex = require('gulp-regex-replace'),
    deleteLines = require('gulp-delete-lines');

var tsProject = ts.createProject('tsconfig.json');
var tsProjectES5 = ts.createProject('tsconfig-es5.json');

/* Clean */
gulp.task("clean", () => del(["./dist"]));

/* Copy tasks */
gulp.task("copy-html", () => gulp.src("src/*.html").pipe(gulp.dest("dist")));
gulp.task("copy-css", () => gulp.src("./css/**/*.css").pipe(gulp.dest("./dist/css")));
gulp.task("copy-assets", () => gulp.src("./assets/**/*.*").pipe(gulp.dest("./dist/assets")));
gulp.task("copy-things", ["copy-html", "copy-css", "copy-assets"]);

/* TS to ES6 */
gulp.task('build-es6', function () {
    gulp.src("src/**/*.ts")
        .pipe(tsProject())
        .pipe(concat('bundle.js'))
        .pipe(replace('export ', ''))
        .pipe(deleteLines({ 'filters': [/import/i] }))
        .pipe(gulp.dest("dist/"))
});

/* TS to ES5 */
gulp.task('build-es5', function () {
    gulp.src("src/**/*.ts")
        .pipe(tsProjectES5())
        .pipe(concat('bundle.js'))
        .pipe(replace('export ', ''))
        .pipe(deleteLines({ 'filters': [/use strict/i] }))
        .pipe(deleteLines({ 'filters': [/Object.defineProperty/i] }))
        .pipe(deleteLines({ 'filters': [/\/\*\* @class \*\//i] }))
        .pipe(deleteLines({ 'filters': [/}\(\)\);/i] }))
        .pipe(deleteLines({ 'filters': [/exports./i] }))
        .pipe(deleteLines({ 'filters': [/require\("/i] }))
        //.pipe(deleteLines({ 'filters': [/(?<=};)(.*)(?=return)(.*)(function)/i] }))
        .pipe(gulp.dest("dist/"))
});


/* Default */
gulp.task("default", function () {
    return runSequence(
        "clean",
        "copy-things",
        "build-es6"
    );
});