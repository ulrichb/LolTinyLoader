import { funcInModuleC } from "ModuleC";

traceMessage("Init of module ModuleA");

export function funcInModuleA(): string {
    return `Hi, I am '${funcInModuleA.name}' and I'm referencing "${funcInModuleC()}"`;
}
