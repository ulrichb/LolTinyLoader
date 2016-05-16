import { ClassC } from "ModuleC";

traceMessage("Init of module ModuleA");

export class ClassA {
    public static say(): string {
        return `Hi, I am '${this.name}' and I'm referencing '${ClassC.say()}'`;
    }
}
