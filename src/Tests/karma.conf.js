module.exports = function (config) {
    config.set({
        frameworks: ["jasmine"],

        basePath: "..",
        files: [
            "Tests/bin/*.js",
            { pattern: "ModulesSample/bin/*.js", included: false }
        ],

        // Add additional "/root/"" path-level in URL and redirect "ModulesSample" to "/", so
        // that we can reference the URL "../ModulesSample/..." in the tests:
        urlRoot: "/root/",
        proxies: {
            "/ModulesSample/": "/base/ModulesSample/"
        },

        preprocessors: {
            '**/*.js': ["coverage"]
        },

        browsers: ["ChromeHeadless"],

        reporters: ["progress", "coverage"],
        coverageReporter: {
            type: "html",
            dir: "Tests/bin/TestCoverage"
        },

        logLevel: config.LOG_INFO
    });
};
