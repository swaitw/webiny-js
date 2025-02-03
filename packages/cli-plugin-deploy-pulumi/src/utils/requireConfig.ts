import { CliContext } from "@webiny/cli/types";

export interface IRequireConfigOptions {
    env: string;
    variant: string | undefined;
    region: string | undefined;
    debug?: boolean;
    cwd: string;
    logs: boolean;
}

export interface IRequireConfigResult {
    commands: {
        build: (options: IRequireConfigOptions) => Promise<void>;
        watch: (options: IRequireConfigOptions, context: CliContext) => Promise<void>;
    };
}

export interface IRequireConfigParams {
    [key: string]: Record<string, any>;
}

export const requireConfig = <T extends IRequireConfigResult = IRequireConfigResult>(
    input: string
): T => {
    const required = require(input);
    /**
     * There is a possibility that the config is a default export.
     */
    return required.default || required;
};

export const requireConfigWithExecute = <T extends IRequireConfigResult = IRequireConfigResult>(
    input: string,
    params: IRequireConfigParams
): T => {
    const required = require(input);
    /**
     * There is a possibility that the config is a default export.
     */
    const resolved = required.default || required;

    if (typeof resolved === "function") {
        return resolved(params);
    }
    return resolved;
};
