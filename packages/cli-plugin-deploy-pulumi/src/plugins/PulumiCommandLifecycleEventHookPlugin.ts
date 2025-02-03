import { CliContext, ProjectApplication } from "@webiny/cli/types";
import { Plugin } from "@webiny/plugins";

export interface CallableParams {
    inputs: Record<string, any>;
    env: string;
    variant: string | undefined;
    projectApplication: ProjectApplication;
}

export interface Callable {
    (params: CallableParams, context: CliContext): void | Promise<void>;
}

export class PulumiCommandLifecycleEventHookPlugin extends Plugin {
    private readonly _callable: Callable;

    public constructor(callable: Callable) {
        super();
        this._callable = callable;
    }

    public async hook(params: CallableParams, context: CliContext): Promise<void> {
        if (typeof this._callable !== "function") {
            throw Error(
                [
                    `Missing callable in PulumiCommandLifecycleEventHookPlugin! Either pass a callable`,
                    `to plugin constructor or extend the plugin and override the "hook" method.`
                ].join(" ")
            );
        }

        return this._callable(params, context);
    }
}
