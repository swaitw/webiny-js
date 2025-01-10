import { Abstraction } from "./Abstraction";
import { Constructor, Dependency } from "./types";

const KEYS = {
    ABSTRACTION: "wby:abstraction",
    DEPENDENCIES: "wby:dependencies"
};

export class Metadata<T extends Constructor> {
    private readonly target: T;

    constructor(target: T) {
        this.target = target;
    }

    getAbstraction(): Abstraction<unknown> {
        return Reflect.getMetadata(KEYS.ABSTRACTION, this.target);
    }

    getDependencies(): Dependency[] {
        return Reflect.getMetadata(KEYS.DEPENDENCIES, this.target);
    }

    setAbstraction(abstraction: Abstraction<unknown>) {
        Reflect.defineMetadata(KEYS.ABSTRACTION, abstraction, this.target);
    }

    setDependencies(dependencies: Dependency[]) {
        Reflect.defineMetadata(KEYS.DEPENDENCIES, dependencies, this.target);
    }
}
