/* globals require, console, __dirname */

const assert = require("assert");
const { spawnSync } = require("child_process");
const gulp = require("gulp");
const gutil = require("gulp-util");
const karma = require("karma");

// Use "vs" env flag to disable build dependencies (the VS solution maintains the dependencies using project references):
var buildDeps = !gutil.env.vs;

gulp.task("build-LolTinyLoader", () => buildTypeScriptProject("src/LolTinyLoader"));
gulp.task("build-ModulesSample", buildDeps ? ["build-LolTinyLoader"] : [], () => buildTypeScriptProject("src/ModulesSample"));
gulp.task("build-Tests", buildDeps ? ["build-ModulesSample"] : [], () => buildTypeScriptProject("src/Tests"));

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
    assert.strictEqual(spawnSync(`npx tsc -p ${projectDirPath}`, { shell: true, stdio: "inherit" }).status, 0);
}
