import { Abstraction } from "./Abstraction";
import {
    Constructor,
    Registration,
    DecoratorRegistration,
    InstanceRegistration,
    Dependencies,
    DependencyOptions,
    LifetimeScope
} from "./types";
import { Metadata } from "./Metadata";

export class Container {
    private registrations = new Map<symbol, Registration[]>();
    private decorators = new Map<symbol, DecoratorRegistration[]>();
    private instances = new Map<symbol, any>();
    private instanceRegistrations = new Map<symbol, InstanceRegistration[]>();
    private parent?: Container;

    register<T>(implementation: Constructor<T>): RegistrationBuilder<T> {
        const metadata = new Metadata(implementation);
        const abstraction = metadata.getAbstraction();
        const dependencies = metadata.getDependencies();

        if (!abstraction) {
            throw new Error(`No abstraction metadata found for ${implementation.name}`);
        }

        const registration: Registration<T> = {
            implementation,
            dependencies: dependencies || [],
            scope: LifetimeScope.Transient
        };

        const existing = this.registrations.get(abstraction.token) || [];
        this.registrations.set(abstraction.token, [...existing, registration]);

        return new RegistrationBuilder(registration);
    }

    registerInstance<T>(abstraction: Abstraction<T>, instance: T): void {
        const registration: InstanceRegistration<T> = { instance };
        const existing = this.instanceRegistrations.get(abstraction.token) || [];
        this.instanceRegistrations.set(abstraction.token, [...existing, registration]);
    }

    registerDecorator<T>(decorator: Constructor<T>): void {
        const metadata = new Metadata(decorator);
        const abstraction = metadata.getAbstraction();
        const dependencies = metadata.getDependencies();

        if (!abstraction) {
            throw new Error(`No abstraction metadata found for ${decorator.name}`);
        }

        const registration: DecoratorRegistration<T> = {
            decoratorClass: decorator,
            dependencies: dependencies || []
        };

        const existing = this.decorators.get(abstraction.token) || [];
        this.decorators.set(abstraction.token, [...existing, registration]);
    }

    resolve<T>(abstraction: Abstraction<T>): T {
        return this.resolveInternal(abstraction, new Map(), {});
    }

    resolveWithDependencies<T extends Constructor>(config: {
        implementation: T;
        dependencies: Dependencies<T>;
    }): InstanceType<T> {
        const { implementation, dependencies } = config;
        const Constructor = implementation;

        const resolvedDeps = dependencies.map(dep => {
            const [abstractionDep, depOptions] = Array.isArray(dep) ? dep : [dep, {}];
            return this.resolveInternal(abstractionDep, new Map(), depOptions);
        });

        return new Constructor(...resolvedDeps);
    }

    createChildContainer(): Container {
        const child = new Container();
        child.parent = this;
        return child;
    }

    private resolveInternal<T>(
        abstraction: Abstraction<T>,
        resolutionStack: Map<symbol, boolean>,
        options: DependencyOptions
    ): T {
        if (resolutionStack.has(abstraction.token)) {
            throw new Error(`Circular dependency detected for ${abstraction.toString()}`);
        }

        const result = this.tryResolveFromCurrentContainer(abstraction, resolutionStack, options);
        if (result !== undefined) {
            return result;
        }

        if (this.parent) {
            return this.parent.resolveInternal(abstraction, resolutionStack, options);
        }

        if (options.optional) {
            return undefined as any;
        }

        throw new Error(`No registration found for ${abstraction.toString()}`);
    }

    private tryResolveFromCurrentContainer<T>(
        abstraction: Abstraction<T>,
        resolutionStack: Map<symbol, boolean>,
        options: DependencyOptions
    ): T | undefined {
        const registrations = this.registrations.get(abstraction.token) || [];
        const instanceRegs = this.instanceRegistrations.get(abstraction.token) || [];

        if (options.multiple) {
            return this.resolveMultiple(
                abstraction,
                registrations,
                instanceRegs,
                resolutionStack
            ) as any;
        }

        if (instanceRegs.length > 0) {
            const instance = instanceRegs[instanceRegs.length - 1].instance;
            return this.applyDecorators(abstraction, instance, resolutionStack);
        }

        if (registrations.length > 0) {
            const registration = registrations[registrations.length - 1];
            return this.resolveRegistration(abstraction, registration, resolutionStack);
        }

        return undefined;
    }

    private resolveRegistration<T>(
        abstraction: Abstraction<T>,
        registration: Registration<T>,
        resolutionStack: Map<symbol, boolean>
    ): T {
        if (registration.scope === LifetimeScope.Singleton) {
            const existing = this.instances.get(abstraction.token);
            if (existing) {
                return existing;
            }
        }

        resolutionStack.set(abstraction.token, true);

        const resolvedDeps = registration.dependencies.map(dep => {
            const [abstractionDep, depOptions] = Array.isArray(dep) ? dep : [dep, {}];
            return this.resolveInternal(abstractionDep, new Map(resolutionStack), depOptions);
        });

        const instance = new registration.implementation(...resolvedDeps);
        const decoratedInstance = this.applyDecorators(abstraction, instance, resolutionStack);

        if (registration.scope === LifetimeScope.Singleton) {
            this.instances.set(abstraction.token, decoratedInstance);
        }

        resolutionStack.delete(abstraction.token);
        return decoratedInstance;
    }

    private resolveMultiple<T>(
        abstraction: Abstraction<T>,
        registrations: Registration[],
        instanceRegistrations: InstanceRegistration[],
        resolutionStack: Map<symbol, boolean>
    ): T[] {
        const results: T[] = [];

        for (const instanceReg of instanceRegistrations) {
            const decorated = this.applyDecorators(
                abstraction,
                instanceReg.instance,
                resolutionStack
            );
            results.push(decorated);
        }

        for (const registration of registrations) {
            const instance = this.resolveRegistration(abstraction, registration, resolutionStack);
            results.push(instance);
        }

        return results;
    }

    private applyDecorators<T>(
        abstraction: Abstraction<T>,
        instance: T,
        resolutionStack: Map<symbol, boolean>
    ): T {
        const decorators = this.decorators.get(abstraction.token) || [];
        let result = instance;

        for (const decorator of decorators) {
            const decoratorDeps = decorator.dependencies.map(dep => {
                const [abstractionDep, depOptions] = Array.isArray(dep) ? dep : [dep, {}];
                return this.resolveInternal(abstractionDep, new Map(resolutionStack), depOptions);
            });

            result = new decorator.decoratorClass(...decoratorDeps, result);
        }

        return result;
    }
}

class RegistrationBuilder<T> {
    constructor(private registration: Registration<T>) {}

    inSingletonScope(): void {
        this.registration.scope = LifetimeScope.Singleton;
    }
}
