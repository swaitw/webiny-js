const { getProjectApplication } = require("@webiny/cli/utils");

module.exports = async options => {
    if (!options) {
        options = {};
    }
    if (!options.cwd) {
        options.cwd = process.cwd();
    }
    const webpack = require("webpack");

    const { overrides, cwd } = options;

    let projectApplication;
    try {
        projectApplication = getProjectApplication({ cwd });
    } catch {
        // No need to do anything.
    }

    // Load base webpack config
    let webpackConfig = require("./webpack.config")({
        production: false,
        projectApplication,
        ...options
    });

    // Customize Webpack config.
    if (typeof overrides.webpack === "function") {
        webpackConfig = overrides.webpack(webpackConfig);
    }

    return new Promise(async (resolve, reject) => {
        let initialCompilation = true;
        if (options.logs) {
            const message = initialCompilation ? "Initial compilation started..." : "Compiling...";
            console.log(message);
        }

        return webpack(webpackConfig).watch({}, async (err, stats) => {
            if (err) {
                return reject(err);
            }

            if (!options.logs) {
                return;
            }

            if (stats.hasErrors()) {
                console.log(stats.toString("errors-warnings"));
                return;
            }

            if (initialCompilation) {
                initialCompilation = false;
                console.log("Initial compilation completed. Watching for changes...");
            }
        });
    });
};
