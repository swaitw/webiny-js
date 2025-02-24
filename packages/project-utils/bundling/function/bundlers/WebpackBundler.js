const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
const { BaseFunctionBundler } = require("./BaseFunctionBundler");
const { createWebpackConfig } = require("./webpack/createWebpackConfig");
const webpack = require("webpack");
const { getProjectApplication } = require("@webiny/cli/utils");

class WebpackBundler extends BaseFunctionBundler {
    constructor(params) {
        super();
        this.params = params;
    }

    build() {
        return new Promise(async (resolve, reject) => {
            let projectApplication;
            try {
                projectApplication = getProjectApplication({ cwd: this.params.cwd });
            } catch {
                // No need to do anything.
            }

            const webpackConfig = createWebpackConfig({
                ...this.params,
                projectApplication,
                production: true
            });

            const compiler = webpack(webpackConfig);

            return compiler.run(async (err, stats) => {
                let messages = {};

                if (err) {
                    messages = formatWebpackMessages({
                        errors: [err.message],
                        warnings: []
                    });

                    const errorMessages = messages.errors.join("\n\n");
                    console.error(errorMessages);
                    return reject(new Error(errorMessages));
                }

                if (stats.hasErrors()) {
                    messages = formatWebpackMessages(
                        stats.toJson({
                            all: false,
                            warnings: true,
                            errors: true
                        })
                    );
                }

                if (Array.isArray(messages.errors) && messages.errors.length) {
                    // Only keep the first error. Others are often indicative
                    // of the same problem, but confuse the reader with noise.
                    if (messages.errors.length > 1) {
                        messages.errors.length = 1;
                    }

                    const errorMessages = messages.errors.join("\n\n");
                    console.error(errorMessages);
                    reject(new Error(errorMessages));
                    return;
                }

                console.log(`Compiled successfully.`);
                resolve();
            });
        });
    }

    watch() {
        return new Promise(async (resolve, reject) => {
            console.log("Compiling...");

            const webpackConfig = createWebpackConfig({
                ...this.params,
                production: true
            });

            return webpack(webpackConfig).watch({}, async (err, stats) => {
                if (err) {
                    return reject(err);
                }

                if (!stats.hasErrors()) {
                    console.log("Compiled successfully.");
                } else {
                    console.log(stats.toString("errors-warnings"));
                }
            });
        });
    }
}

module.exports = { WebpackBundler };
