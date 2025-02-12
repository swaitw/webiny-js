import { serializeError } from "serialize-error";
import { cli } from "@webiny/cli";
import { requireConfigWithExecute } from "~/utils";

const workerData = JSON.parse(process.argv[2]);
const { package: pkg, env, variant, region, debug } = workerData;

const options = { cwd: pkg.paths.root, env, variant, region, debug };

const config = requireConfigWithExecute(pkg.paths.config, {
    options,
    context: cli
});

const hasBuildCommand = config.commands && typeof config.commands.build === "function";
if (!hasBuildCommand) {
    throw new Error("Build command not found.");
}

config.commands.build(options).catch(error => {
    // Send error message to the parent process
    process.send!(serializeError(error));
    process.exit(1); // Ensure the worker process exits with an error code
});
