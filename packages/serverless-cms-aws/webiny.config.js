const glob = require("fast-glob");
const path = require("path");
const { Listr } = require("listr2");
const { createWatchPackage, createBuildPackage } = require("@webiny/project-utils");

async function buildHandlers(options) {
    if (process.env.WEBINY_SERVERLESS_CMS_AWS_SKIP_PREPUBLISH_ONLY === "true") {
        console.log("Skipping building of handlers...");
        return;
    }

    // Bundle all handlers. These are then used directly in real Webiny projects.
    const handlerPaths = glob.sync(`${__dirname}/handlers/**/webiny.config.js`);

    const runner = new Listr(
        [
            {
                title: "Build handlers for user projects",
                task(ctx, task) {
                    return task.newListr(
                        handlerPaths.map(handlerPath => {
                            return {
                                title: path.dirname(handlerPath).replace(__dirname, "."),
                                async task() {
                                    await require(handlerPath).commands.build({
                                        ...options,
                                        logs: false
                                    });
                                }
                            };
                        })
                    );
                }
            }
        ],
        { concurrent: true, rendererOptions: { showTimer: true, collapse: false } }
    );
    await runner.run();
}

module.exports = {
    commands: {
        build: options => {
            // We're skipping library checking because `@rspack/core package` had internal
            // Typescript issues that we couldn't resolve. We'll revisit this later.
            // More info: https://github.com/web-infra-dev/rspack/issues/9154
            return createBuildPackage({ cwd: __dirname })({
                ...options,
                overrides: {
                    ...options.overrides,
                    tsConfig: { compilerOptions: { skipLibCheck: true } }
                }
            });
        },
        watch: createWatchPackage({ cwd: __dirname }),
        buildHandlers
    }
};
