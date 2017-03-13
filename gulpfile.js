/* globals require, console, __dirname */

var process = require("process");
var gulp = require("gulp");
var gutil = require("gulp-util");
var ts = require("gulp-typescript");
var karma = require("karma");
var merge = require("merge2");
var sourcemaps = require("gulp-sourcemaps");

// Use "vs" env flag to disable build dependencies (the VS solution maintains the dependencies using project references):
var buildDeps = !gutil.env.vs;

gulp.task("build-LolTinyLoader", buildTypeScriptProject("src/LolTinyLoader"));
gulp.task("build-ModulesSample", buildDeps ? ["build-LolTinyLoader"] : [], buildTypeScriptProject("src/ModulesSample"));
gulp.task("build-Tests", buildDeps ? ["build-ModulesSample"] : [], buildTypeScriptProject("src/Tests"));

gulp.task("build", ["build-Tests"]);

gulp.task("test", ["build"], function (done) {
    new karma.Server({
        configFile: __dirname + "/src/Tests/karma.conf.js",
        singleRun: true
    }, done).start();
});

gulp.task("dist", ["test"], function () {
    return gulp.src([
        "src/LolTinyLoader/*.ts",
        "src/LolTinyLoader/bin/*.d.ts",
        "src/LolTinyLoader/bin/*.js"
    ]).pipe(gulp.dest("dist"));
});

gulp.task("default", ["dist"]);

function buildTypeScriptProject(projectDirPath) {
    return function () {
        var tsProject = ts.createProject(projectDirPath + "/tsconfig.json");

        var tsResult = tsProject.src()
            .pipe(sourcemaps.init())
            .pipe(tsProject(msbuildReporter()))
            .once("error", function () { this.once("finish", () => process.exit(1)); });

        return merge([
            tsResult.js
                .pipe(sourcemaps.write())
                .pipe(gulp.dest(projectDirPath)),
            tsResult.dts
                .pipe(gulp.dest(projectDirPath))
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
