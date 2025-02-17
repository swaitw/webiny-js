import path from "path";
import fs from "fs";
import glob from "fast-glob";
import { getProject } from "@webiny/cli/utils";
import { GracefulError, splitStackName } from "~/utils";
import type { IStack } from "./Stack";
import { createStack } from "./Stack";
import type { NonEmptyArray } from "@webiny/cli/types";

export interface IGetStacksParams {
    folders: string[];
    env: string;
    variants: NonEmptyArray<string | undefined> | undefined;
    cwd?: string;
}

export interface IApplicationStacks {
    app: string;
    env: string;
    folder: string;
    stacks: IStack[];
}

export const getApplicationsStacks = (params: IGetStacksParams): IApplicationStacks[] => {
    const project = getProject();
    const { folders, env, cwd, variants } = params;

    return folders.map(folder => {
        const app = folder.split("/").pop();
        if (!app) {
            throw new GracefulError(`Cannot determine application name from folder: ${folder}`);
        }

        const target = path.join(cwd || project.root, ".pulumi", folder, ".pulumi", "stacks", app);

        if (!fs.existsSync(target)) {
            throw new GracefulError(
                `Stacks folder "${target}" does not exist. Did you deploy the "${folder}" application?`
            );
        }

        const match = `${target}/${env}*.json`;

        const stacks = glob
            .sync(match, {})
            .map(file => {
                const parts = file.replace(".json", "").split("/");
                const part = parts.pop();
                if (!part) {
                    return null;
                }
                const { env, variant } = splitStackName(part);

                if (variants && variant && !variants.includes(variant)) {
                    console.log({
                        env,
                        variants,
                        variant
                    });
                    return null;
                }

                return createStack({
                    env,
                    variant,
                    app,
                    folder
                });
            })
            .filter((item): item is IStack => !!item);

        if (!stacks.length) {
            throw new GracefulError(`There are no stacks in "${target}" for environment "${env}".`);
        }
        return {
            app,
            env,
            folder,
            stacks
        };
    });
};
