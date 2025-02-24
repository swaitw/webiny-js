import path from "path";
import { CliCommandPlugin, CliCommandPluginArgs } from "@webiny/cli/types";
import { createDependencyTree } from "./references";
import { createReferenceFile } from "./references/createReferenceFile";
import { verifyDependencies } from "./references/verifyDependencies";

const getDirname = (): string => {
    let name = __dirname;
    if (name.endsWith("/dist")) {
        name = name.replace("/dist", "");
    }
    return path.join(name, "../cli/files/");
};

const createReferenceFileCommandExecutor = ({ context }: Pick<CliCommandPluginArgs, "context">) => {
    return async () => {
        const dirname = getDirname();
        const tree = createDependencyTree({
            context,
            dirname
        });

        createReferenceFile({
            tree,
            dirname,
            context
        });
    };
};

const verifyDependenciesFileCommandExecutor = ({
    context
}: Pick<CliCommandPluginArgs, "context">) => {
    return async () => {
        const dirname = getDirname();
        const tree = createDependencyTree({
            context,
            dirname
        });

        verifyDependencies({
            tree,
            dirname
        });
    };
};

export default (): CliCommandPlugin[] => {
    return [
        {
            type: "cli-command",
            name: "cli-command-sync-dependencies",
            create({ yargs, context }) {
                yargs.command(
                    "sync-dependencies",
                    "Sync dependencies for all packages.",
                    (yargs: Record<string, any>) => {
                        yargs.example("$0 sync-dependencies");
                    },
                    createReferenceFileCommandExecutor({ context })
                );
            }
        },
        {
            type: "cli-command",
            name: "cli-command-verify-dependencies",
            create({ yargs, context }) {
                yargs.command(
                    "verify-dependencies",
                    "Verify dependencies for all packages.",
                    (yargs: Record<string, any>) => {
                        yargs.example("$0 verify-dependencies");
                    },
                    verifyDependenciesFileCommandExecutor({ context })
                );
            }
        }
    ];
};
