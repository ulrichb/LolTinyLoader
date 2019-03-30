/* globals require, console, __dirname */

import { spawn } from "child_process";
import gulp from "gulp";

const buildLolTinyLoader = () => shellExec(`npx tsc -p ${"src/LolTinyLoader"}`);
const buildModulesSample = () => shellExec(`npx tsc -p ${"src/ModulesSample"}`);
const buildTests = () => shellExec(`npx tsc -p ${"src/Tests"}`);

export const build = gulp.parallel(buildLolTinyLoader, buildModulesSample, buildTests);

const runTests = () => shellExec(`npx karma start src/Tests/karma.conf.js --single-run`);
export const test = gulp.series(build, runTests);

function copyToDist() {
    return gulp.src([
        "src/LolTinyLoader/*.ts",
        "src/LolTinyLoader/bin/*.d.ts",
        "src/LolTinyLoader/bin/*.js"
    ]).pipe(gulp.dest("dist"));
}
export const dist = gulp.series(test, copyToDist);

export default dist;

function shellExec(command) {
    return spawn(command, { shell: true, stdio: "inherit" });
}
