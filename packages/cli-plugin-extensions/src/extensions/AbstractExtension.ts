import { ExtensionMessage } from "~/types";

export interface ExtensionTypeConstructorParams {
    name: string;
    type: string;
    location: string;
    packageName: string;
}

export abstract class AbstractExtension {
    protected params: ExtensionTypeConstructorParams;

    constructor(params: ExtensionTypeConstructorParams) {
        this.params = params;
    }

    abstract link(): Promise<void>;

    abstract getNextSteps(): ExtensionMessage[];

    getPackageJsonPath(): string {
        return `${this.params.location}/package.json`;
    }

    getLocation(): string {
        return this.params.location;
    }

    getPackageName(): string {
        return this.params.packageName;
    }

    getName(): string {
        return this.params.name;
    }
}
