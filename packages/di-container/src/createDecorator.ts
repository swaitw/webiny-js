import { Abstraction } from "./Abstraction";
import { Constructor, Dependency, GetInterface, MapDependencies } from "./types";
import { Metadata } from "./Metadata";

type DropLast<T> = T extends [...infer P, any] ? [...P] : never;

type GetLast<T> = T extends [...any, infer Last] ? Last : never;

type Implementation<
    A extends Abstraction<any>,
    I extends Constructor
> = GetInterface<A> extends GetLast<ConstructorParameters<I>> ? I : "Wrong decoratee type!";

export function createDecorator<A extends Abstraction<any>, I extends Constructor>(params: {
    abstraction: A;
    decorator: Implementation<A, I>;
    dependencies: MapDependencies<DropLast<ConstructorParameters<I>>>;
}): Implementation<A, I> {
    const metadata = new Metadata(params.decorator as Constructor);
    metadata.setAbstraction(params.abstraction);
    metadata.setDependencies(params.dependencies as unknown as Dependency[]);

    return params.decorator;
}
