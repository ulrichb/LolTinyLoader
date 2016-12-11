/// <reference path="TestInfrastructure.ts" />

describeScopedLolTinyLoader((getTraceMessages) => {

    describe("LolTinyLoader executing ModulesSample", () => {

        // This is an integrative test based on "ModulesSample"

        const modulesSampleJsPath = "../ModulesSample/bin/ModulesSample.js";

        let script: HTMLScriptElement;

        beforeEach(done => {
            script = document.createElement("script");
            script.src = modulesSampleJsPath;
            script.addEventListener("load", done);
            document.head.appendChild(script);
        });
        afterEach(() => {
            document.head.removeChild(script);
        });

        it("registers all modules of sample", () => {

            expect(LolTinyLoader.registry.getAllModuleNames()).toEqual([
                "ModuleD",
                "ModuleC",
                "ModuleA",
                "ModuleB",
                "DefaultExportModule",
                "OptionalModule",
                "Main"
            ]);
        });

        it("emits expected trace messages during 'Main' module execution", () => {
            require("Main");

            expect(getTraceMessages()).toEqual([
                "Init of module ModuleD",
                "Init of module ModuleC",
                "Init of module ModuleA",
                "Init of module ModuleB",
                "Init of module DefaultExportModule",
                "Init of module Main",
                "In Main, funcInModuleA says: Hi, I am 'funcInModuleA' and I'm referencing \"Hi, I am 'funcInModuleC' and I'm referencing 'ClassInModuleD'\".",
                "In Main, funcInModuleB says: Hi, I am 'funcInModuleB'.",
                "In Main, we also reference ClassInModuleD.",
                "In Main, defaultExportModuleValue is 'my default'.",
                "Init of module OptionalModule",
                "In Main, loaded OptionalModule: 'OptionalModule value'.",
                "In Main, second access to OptionalModule: 'OptionalModule value'."
            ]);
        });
    });
});
