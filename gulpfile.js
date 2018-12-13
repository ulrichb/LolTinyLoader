/* globals require, console, __dirname */

const assert = require("assert");
const { spawnSync } = require("child_process");
const gulp = require("gulp");
const karma = require("karma");

gulp.task("build-LolTinyLoader", () => shellExecSync(`npx tsc -p ${"src/LolTinyLoader"}`));
gulp.task("build-ModulesSample", ["build-LolTinyLoader"], () => shellExecSync(`npx tsc -p ${"src/ModulesSample"}`));
gulp.task("build-Tests", ["build-ModulesSample"], () => shellExecSync(`npx tsc -p ${"src/Tests"}`));

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

function shellExecSync(command) {
    assert.strictEqual(spawnSync(command, { shell: true, stdio: "inherit" }).status, 0);
}
