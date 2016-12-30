let require: (module: string) => any;
let define: (name: string, dependencies: string[], moduleFunction: (...args: any[]) => void) => any;

namespace LolTinyLoader {

    /** Represents the registration of all modules */
    export interface Registry {

        /** Resets the registry (removes all module registrations) */
        clear(): void;

        /** Returns an array of all registered module names in an undefined order */
        getAllModuleNames(): string[];
    }

    interface RecursiveResolver {
        resolve(name: string, resolveChain: string[]): any;
    }

    class RegistryImpl implements Registry, RecursiveResolver {

        private moduleRegistrations: { [moduleName: string]: ModuleRegistration };

        public constructor() {
            this.clear();
        }

        public addModuleRegistration(name: string, moduleRegistration: ModuleRegistration) {
            if (this.moduleRegistrations.hasOwnProperty(name))
                throw `double registration of module '${name}'`;

            this.moduleRegistrations[name] = moduleRegistration;
        }

        public resolve(name: string, resolveChain: string[]): any {
            if (!this.moduleRegistrations.hasOwnProperty(name))
                throw `module '${name}' is not registered (missing 'define()')`;

            const moduleRegistration = this.moduleRegistrations[name];

            const newResolveChain = resolveChain.concat(name);

            if (resolveChain.indexOf(name) >= 0)
                throw `circular dependency detected: '${newResolveChain.join("' -> '")}'`;

            return moduleRegistration.resolve(newResolveChain);
        }

        public clear(): any {
            this.moduleRegistrations = { };
        }

        public getAllModuleNames(): string[] {
            return Object.keys(this.moduleRegistrations);
        }

        public withSpecialRegistrations(specialRegistrations: { [name: string]: any }): RecursiveResolver {
            return {
                resolve: (name: string, resolveChain: string[]) => {
                    if (specialRegistrations.hasOwnProperty(name))
                        return specialRegistrations[name];

                    return this.resolve(name, resolveChain);
                }
            };
        }
    }

    const registryImpl = new RegistryImpl();

    /** Represents the registration of a single module */
    class ModuleRegistration {

        private resolvedExports: any = null;

        public constructor(
            private readonly dependencies: string[],
            private readonly moduleFunction: (...args: any[]) => void) {
        }

        public resolve(resolveChain: string[]): any {
            if (this.resolvedExports === null) {
                const exports = { };

                const resolverWithSpecialRegistrations = registryImpl
                    .withSpecialRegistrations({ require: require, exports: exports });

                const resolvedDependencies = this.dependencies
                    .map(dependency => resolverWithSpecialRegistrations.resolve(dependency, resolveChain));

                this.moduleFunction.apply(exports, resolvedDependencies);
                this.resolvedExports = exports;
            }

            return this.resolvedExports;
        }
    }

    /** The global `define`-function defined before executing `LolTinyLoader`  */
    export const previousDefine: any = define;

    define = (name, dependencies, moduleFunction) => {
        const moduleRegistration = new ModuleRegistration(dependencies, moduleFunction);
        registryImpl.addModuleRegistration(name, moduleRegistration);
    };

    /** The global `require`-function defined before executing `LolTinyLoader`  */
    export const previousRequire: any = require;

    require = (name) => registryImpl.resolve(name, []);

    export const registry: Registry = registryImpl;
}
