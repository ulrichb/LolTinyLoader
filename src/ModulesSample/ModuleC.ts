import { ClassD } from "ModuleD";

traceMessage("Init of module ModuleC");

export class ClassC {
    public static say(): string {
        return `Hi, I am '${this.name}' and I'm referencing '${ClassD.name}'`;
    }
}
