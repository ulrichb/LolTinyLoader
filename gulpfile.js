/* globals require, console, __dirname */

const assert = require("assert");
const { spawn } = require("child_process");
const gulp = require("gulp");

const buildLolTinyLoader = () => shellExec(`npx tsc -p ${"src/LolTinyLoader"}`);
const buildModulesSample = () => shellExec(`npx tsc -p ${"src/ModulesSample"}`);
const buildTests = () => shellExec(`npx tsc -p ${"src/Tests"}`);

const build = gulp.parallel(buildLolTinyLoader, buildModulesSample, buildTests);
exports.build = build;

const runTests = () => shellExec(`npx karma start src/Tests/karma.conf.js --single-run`);
const test = gulp.series(build, runTests);
exports.test = test;

function copyToDist() {
    return gulp.src([
        "src/LolTinyLoader/*.ts",
        "src/LolTinyLoader/bin/*.d.ts",
        "src/LolTinyLoader/bin/*.js"
    ]).pipe(gulp.dest("dist"));
}
const dist = gulp.series(test, copyToDist);
exports.dist = dist;

exports.default = dist;

function shellExec(command) {
    return new Promise((res, rej) =>
        spawn(command, { shell: true, stdio: "inherit" }).on('exit', (code) => {
            if (code === null || code > 0)
                rej(new Error('Exit code: ' + code));
            res();
        }));
}
