import { ClassInModuleD } from "ModuleD";

traceMessage("Init of module ModuleC");

export function funcInModuleC(): string {
    const classInModuleD = new ClassInModuleD();
    return `Hi, I am '${funcInModuleC.name}' and I'm referencing '${classInModuleD.introduce()}'`;
}
