# LolTinyLoader

[![Build status](https://ci.appveyor.com/api/projects/status/txl32mi8hm99d59b/branch/master?svg=true)](https://ci.appveyor.com/project/ulrichb/loltinyloader/branch/master)
[![npm package](https://img.shields.io/npm/v/lol-tiny-loader.svg)](https://www.npmjs.com/package/lol-tiny-loader)
[![devDependencies Status](https://david-dm.org/ulrichb/LolTinyLoader/dev-status.svg)](https://david-dm.org/ulrichb/LolTinyLoader?type=dev)

LolTinyLoader is a minimalistic ECMAScript module loader, implementing the [AMD](https://en.wikipedia.org/wiki/Asynchronous_module_definition) module specification like [RequireJS](http://requirejs.org/).

## Difference between RequireJS and LolTinyLoader
* LolTinyLoader allows to synchronously resolve modules using `var mod = require("my/module")`. RequireJS can only resolve modules asynchronously using `require(["my/module"], function (mod) { /* callback */ })`; `require("my/module")` only returns already loaded modules.
* LolTinyLoader offers an easy possibility to query all registered modules, using `LolTinyLoader.registry.getAllModuleNames()`.
* LolTinyLoader does _not_ support asynchronous lazy loading of modules as RequireJS, and other advanced features.

## Motivation
LolTinyLoader has been written to support ECMAScript 2015 modules in [TypeScript](http://www.typescriptlang.org/). The TypeScript compiler supports to emit all modules into one file using the AMD, or alternatively the SystemJS standard (see [--outFile and --module compiler options](http://www.typescriptlang.org/docs/handbook/compiler-options.html)). To still be able to run the module code synchronously (like it is possibly with TypeScript's namespaces (aka. "internal modules") this loader has been implemented.

Therefore, LolTinyLoader doesn't implement the whole AMD specification; just what it is necessary to load TypeScript-generated AMD modules.

See [ModulesSample](./src/ModulesSample/) ([Main.ts](./src/ModulesSample/Main.ts)) for an example.

### Jasmine spec modules

LolTinyLoader also works well to reliably load Jasmine specs AMD modules using the following loader code.

```JS
LolTinyLoader.registry
    .getAllModuleNames()
    .filter(function (module) { return /Spec$/.test(module); })
    .forEach(function (module) { require(module); });
```

This synchronous loading of the spec _definitions_ avoids issues with delayed asynchronous spec definitions e.g. when using the karma-jasmine PhantomJS loader.
