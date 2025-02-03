import { IUserCommandInput } from "~/types";
import execa from "execa";
import { WebinyConfigFile } from "./WebinyConfigFile";
import { requireConfig } from "~/utils";

interface IListPackagesParams {
    inputs: IUserCommandInput;
}

export const listPackages = async ({ inputs }: IListPackagesParams) => {
    let packagesList: string[] = [];
    if (inputs.package) {
        packagesList = Array.isArray(inputs.package) ? inputs.package : [inputs.package];
    } else {
        packagesList = await execa("yarn", [
            "webiny",
            "workspaces",
            "tree",
            "--json",
            "--depth",
            String(inputs.depth || ""),
            "--distinct",
            "--folder",
            inputs.folder
        ]).then(({ stdout }: Record<string, any>) => JSON.parse(stdout));
    }

    const commandArgs: string[] = [
        "webiny",
        "workspaces",
        "list",
        "--json",
        "--withPath",
        ...packagesList.reduce<string[]>((current, item) => {
            current.push("--scope", item);
            return current;
        }, [])
    ];

    if (inputs.env) {
        commandArgs.push("--env", inputs.env);
    }

    return execa("yarn", commandArgs).then(({ stdout }: Record<string, any>) => {
        const result = JSON.parse(stdout) as Record<string, string>;
        const packages = [];
        for (const packageName in result) {
            const root = result[packageName];
            const configPath = WebinyConfigFile.forWorkspace(root).getAbsolutePath();

            if (!configPath) {
                continue;
            }

            const config = requireConfig(configPath);

            packages.push({
                name: packageName,
                config,
                paths: {
                    root,
                    config: configPath
                }
            });
        }

        return packages;
    });
};
