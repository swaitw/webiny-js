import { parentPort, workerData } from "worker_threads";
import { cli } from "@webiny/cli";
import { requireConfigWithExecute } from "~/utils";

let processStdout = "";
let processStderr = "";

const originalStdoutWrite = process.stdout.write.bind(process.stdout);
/**
 * TODO @adrian
 *
 * Check this out.
 */
// @ts-expect-error
process.stdout.write = (chunk, encoding, callback) => {
    if (typeof chunk === "string") {
        processStdout += chunk;
    }

    return originalStdoutWrite(chunk, encoding, callback);
};

const originalStderrWrite = process.stderr.write.bind(process.stderr);
/**
 * TODO @adrian
 *
 * Check this out.
 */
// @ts-expect-error
process.stderr.write = (chunk, encoding, callback) => {
    if (typeof chunk === "string") {
        processStderr += chunk;
    }

    return originalStderrWrite(chunk, encoding, callback);
};

const { options, package: pckg } = workerData;

const config = requireConfigWithExecute(pckg.config, {
    options: {
        ...options,
        cwd: pckg.root
    },
    context: cli
});

const hasBuildCommand = config.commands && typeof config.commands.build === "function";
if (!hasBuildCommand) {
    throw new Error("Build command not found.");
}

config.commands
    .build(options)
    .then(() => {
        parentPort!.postMessage(
            JSON.stringify({ type: "success", stdout: processStdout, stderr: processStderr })
        );
    })
    .catch((e: Error) => {
        parentPort!.postMessage(
            JSON.stringify({
                type: "error",
                stdout: processStdout,
                stderr: processStderr,
                error: {
                    message: e.message,
                    stack: e.stack
                }
            })
        );
    });
