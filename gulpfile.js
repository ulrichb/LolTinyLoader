/* globals require, console */

var gulp = require("gulp");
var ts = require("gulp-typescript");
var merge = require("merge2");
var sourcemaps = require("gulp-sourcemaps");

// The order reflects the dependency chain and is maintained here instead of the individual tasks to avoid unnecessary
// build calls in VS (in the VS solution the same dependency chain is maintained using project references).
gulp.task("build", ["build-LolTinyLoader", "build-ModulesSample", "build-Tests"]);

gulp.task("dist", ["build-LolTinyLoader"], function () {
    return gulp.src([
        "src/LolTinyLoader/*.ts",
        "src/LolTinyLoader/bin/*.d.ts",
        "src/LolTinyLoader/bin/*.js"
    ]).pipe(gulp.dest("dist"));
});

gulp.task("default", ["build"]);

gulp.task("build-LolTinyLoader", buildTypeScriptProject("src/LolTinyLoader"));
gulp.task("build-ModulesSample", buildTypeScriptProject("src/ModulesSample"));
gulp.task("build-Tests", buildTypeScriptProject("src/Tests"));

function buildTypeScriptProject(projectDirPath) {
    return function () {
        var tsProject = ts.createProject(projectDirPath + "/tsconfig.json");

        var tsResult = tsProject.src()
            .pipe(sourcemaps.init())
            .pipe(tsProject(msbuildReporter()));

        return merge([
            tsResult.js
                .pipe(sourcemaps.write())
                .pipe(gulp.dest(".")),
            tsResult.dts
                .pipe(gulp.dest("."))
        ]);
    };
}

/** 
 * An MSBuild/VS-compatible reporter (to enable jumping to the error list
 * entries in VS)
 */
function msbuildReporter() {
    var reporter = Object.create(ts.reporter.defaultReporter());
    reporter.error = function (error) {

        function flattenMessages(message) {
            if (message.messageText) {
                var nestedMessageText =
                    message.next ? " >>> " + flattenMessages(message.next) : "";
                return message.messageText + nestedMessageText;
            } else
                return message;
        }

        if (error.tsFile) {
            var fileAndPosition = error.fullFilename + "(" +
                (error.startPosition.line + 1) + "," +
                (error.startPosition.character + 1) + "): ";
            console.error(fileAndPosition + "error TS" + error.diagnostic.code +
                ": " + flattenMessages(error.diagnostic.messageText));
        } else {
            console.error(error.message);
        }
    };
    return reporter;
}
