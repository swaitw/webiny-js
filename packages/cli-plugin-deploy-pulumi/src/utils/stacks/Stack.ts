import type { IStackOutput } from "~/utils";

export interface IStack<T extends IStackOutput | undefined = undefined> {
    readonly app: string;
    readonly folder: string;
    readonly env: string;
    readonly variant: string | undefined;
    output?: T;
    withOutput<O extends IStackOutput>(output: O): Required<IStack<O>>;
}

export interface IStackParams<T extends IStackOutput | undefined = undefined> {
    app: string;
    folder: string;
    env: string;
    variant: string | undefined;
    output?: T;
}

export class Stack<T extends IStackOutput | undefined = undefined> implements IStack<T> {
    public readonly app: string;
    public readonly folder: string;
    public readonly env: string;
    public readonly variant: string | undefined;
    public readonly output?: T;

    public constructor(params: IStackParams<T>) {
        this.app = params.app;
        this.folder = params.folder;
        this.env = params.env;
        this.variant = params.variant;
        if (!params.output) {
            return;
        }
        this.output = structuredClone(params.output);
    }

    public withOutput<O extends IStackOutput>(output: O): Required<IStack<O>> {
        /**
         * We can safely cast as we know that the output is defined.
         */
        return new Stack<O>({
            app: this.app,
            folder: this.folder,
            env: this.env,
            variant: this.variant,
            output: structuredClone(output)
        }) as Required<IStack<O>>;
    }
}

export const createStack = <T extends IStackOutput | undefined = undefined>(
    params: IStackParams<T>
): IStack<T> => {
    return new Stack<T>(params);
};
