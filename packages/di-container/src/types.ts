import "reflect-metadata";
import { Abstraction } from "./Abstraction";

export type Constructor<T = any> = new (...args: any[]) => T;

export type GetInterface<T> = T extends Abstraction<infer U> ? U : never;

export interface DependencyOptions {
    multiple?: boolean;
    optional?: boolean;
}

export type Dependency = Abstraction<any> | [Abstraction<any>, DependencyOptions];

export interface Registration<T = any> {
    implementation: Constructor<T>;
    dependencies: Dependency[];
    scope: LifetimeScope;
}

export interface DecoratorRegistration<T = any> {
    decoratorClass: Constructor<T>;
    dependencies: Dependency[];
}

export interface InstanceRegistration<T = any> {
    instance: T;
}

export enum LifetimeScope {
    Transient,
    Singleton
}

export type IsOptionalValue<T> = undefined extends T ? T : never;
export type IsArray<T extends Array<any>> = Array<any> extends T ? T : never;
export type GetAbstractionFromArray<T> = T extends Array<infer A> ? Abstraction<A> : never;
export type Multiple = { multiple: true };
export type Optional = { optional: true };

declare const implementation: unique symbol;

export type Implementation<T extends Constructor> = T & {
    [implementation]: "Implementation";
};

export type MapDependencies<T extends [...any]> = {
    [K in keyof T]-?: T[K] extends IsArray<T[K]>
        ? // Requires an array of implementations.
          [
              GetAbstractionFromArray<T[K]>,
              T[K] extends IsOptionalValue<T[K]> ? Multiple & Optional : Multiple
          ]
        : // Requires a single implementation.
        T[K] extends IsOptionalValue<T[K]>
        ? [Abstraction<T[K]>, Optional]
        : Abstraction<T[K]>;
};

export type Dependencies<T> = T extends Constructor
    ? MapDependencies<ConstructorParameters<T>>
    : never;
