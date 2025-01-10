import { Abstraction } from "./Abstraction";
import { Constructor, Dependencies, Implementation, GetInterface } from "./types";
import { Metadata } from "./Metadata";

export function createImplementation<
    A extends Abstraction<any>,
    I extends Constructor<GetInterface<A>>
>(params: { abstraction: A; implementation: I; dependencies: Dependencies<I> }) {
    const metadata = new Metadata(params.implementation);
    metadata.setAbstraction(params.abstraction);
    metadata.setDependencies(params.dependencies);

    return params.implementation as Implementation<I>;
}
