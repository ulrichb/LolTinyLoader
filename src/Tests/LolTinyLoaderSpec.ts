﻿/// <reference path="TestInfrastructure.ts" />

// ReSharper disable AmdExternalModule
// ReSharper disable CommonJsExternalModule

describeScopedLolTinyLoader((getTraceMessages) => {

    const dontCareModuleFunc = fail;

    describe("LolTinyLoader", () => {

        it("passes exports as require() result", () => {
            define("mod", ["exports"], (exports) => {
                exports.value = "my export value";
            });

            const requireResult = require("mod");

            expect(requireResult.value).toBe("my export value");
        });

        it("passes exports as dependency value", () => {
            define("modB", ["exports"], (exports) => {
                exports.value = "modB export value";
            });
            define("modA", ["modB"], (dependency) => {
                traceMessage(`dependency value in modA: '${dependency.value}'`);
            });

            require("modA");

            expect(getTraceMessages()).toEqual(["dependency value in modA: 'modB export value'"]);
        });

        it("passes exports as this reference to module function", () => {
            let thisReferenceInsideModule: unknown;
            let exportsReferenceInsideModule: unknown;

            define("mod", ["exports"], function (this: unknown, exports) {
                thisReferenceInsideModule = this;
                exportsReferenceInsideModule = exports;
            });

            const mod = require("mod");

            expect(mod).toBe(exportsReferenceInsideModule);
            expect(thisReferenceInsideModule).toBe(exportsReferenceInsideModule); // Same behavior as in Node.js/RequireJS
        });

        it("resolves all dependencies in correct order", () => {
            define("modB", ["modC"], () => { traceMessage("loaded modB"); });
            define("modA", ["modB"], () => { traceMessage("loaded modA"); });
            define("modC", [], () => { traceMessage("loaded modC"); });

            require("modA");

            expect(getTraceMessages()).toEqual(["loaded modC", "loaded modB", "loaded modA"]);
        });

        it("executes module function only once", () => {
            define("mod", [], () => { traceMessage("loaded mod"); });

            require("mod");
            require("mod");
            require("mod");

            expect(getTraceMessages()).toEqual(["loaded mod"]);
        });

        it("throws on double registration", () => {
            define("mod", [], dontCareModuleFunc);

            const act = () => define("mod", [], dontCareModuleFunc);

            expect(act).toThrow("double registration of module 'mod'");
        });

        const unresolvableModuleNames = [
            "modX",
            // tests that object prototype members cannot be resolved:
            "toString"
        ];

        unresolvableModuleNames.forEach(moduleName => {
            it(`throws when resolving unregistered module '${moduleName}'`, () => {
                const act = () => require(moduleName);

                expect(act).toThrow(`module '${moduleName}' is not registered (missing 'define()')`);
            });
        });

        unresolvableModuleNames.forEach(moduleName => {
            it(`throws when resolving unregistered module '${moduleName}' as dependency`, () => {
                define("modA", ["modB"], dontCareModuleFunc);
                define("modB", [moduleName], dontCareModuleFunc);

                const act = () => require("modA");

                expect(act).toThrow(`module '${moduleName}' is not registered (missing 'define()')`);
            });
        });

        it("provides the require() function as dependency", () => {
            let requireAsDependency: unknown;
            define("mod", ["require"], (r) => { requireAsDependency = r });

            require("mod");

            expect(requireAsDependency).toBe(require);
        });

        it("detects circular dependencies", () => {
            define("modA", ["modB"], dontCareModuleFunc);
            define("modB", ["modC"], dontCareModuleFunc);
            define("modC", ["modA"], dontCareModuleFunc);

            const act = () => require("modA");

            expect(act).toThrow("circular dependency detected: 'modA' -> 'modB' -> 'modC' -> 'modA'");
        });

        it("provides all module names", () => {
            define("modC", [], dontCareModuleFunc);
            define("modA", [], dontCareModuleFunc);
            define("modB", [], dontCareModuleFunc);

            const registeredModuleNames = LolTinyLoader.registry.getAllModuleNames();

            // note that the order is not defines
            expect(registeredModuleNames.sort()).toEqual(["modA", "modB", "modC"]);
        });

        it("previousDefine", () => {
            const previousDefine = LolTinyLoader.previousDefine;

            expect(previousDefine).not.toEqual(define);
        });

        it("previousRequire", () => {
            const previousRequire = LolTinyLoader.previousRequire;

            expect(previousRequire).not.toEqual(require);
        });
    });
});
