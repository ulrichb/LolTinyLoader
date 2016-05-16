import { ClassA } from "ModuleA";
import { ClassB } from "ModuleB";
import { ClassD } from "ModuleD";
import defaultExportModuleValue from "DefaultExportModule";
import {} from "OptionalModule"; // doesn't import here, but makes sure that the module is part of the compilation

/*
           Main
          /  | \________________ . . . . . . . . . . . 
         /   |     \            \                     .
        v    |      \            \                     .
    ModuleA  |       v            v                     v
       |     |    ModuleB    DefaultExportModule    OptionalModule
       v     |
    ModuleC  |
        \    |
         v   v
         ModuleD
*/

traceMessage("Init of module Main");
traceMessage(`In Main, ClassA says: ${ClassA.say()}.`);
traceMessage(`In Main, ClassB says: ${ClassB.say()}.`);
traceMessage(`In Main, we also reference ${ClassD.name}`);
traceMessage(`In Main, defaultExportModuleValue is '${defaultExportModuleValue}'.`);


// "Optional Module Loading" via require() call, see http://www.typescriptlang.org/docs/handbook/modules.html:
declare function require(moduleName: string): any;

// ReSharper disable CommonJsExternalModule
traceMessage(`In Main, loaded OptionalModule: '${require("OptionalModule").val}'.`);
traceMessage(`In Main, second access to OptionalModule: '${require("OptionalModule").val}'.`);
// ReSharper restore CommonJsExternalModule
