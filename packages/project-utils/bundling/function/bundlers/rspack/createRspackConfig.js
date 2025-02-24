const path = require("path");
const rspack = require("@rspack/core");
const { version } = require("@webiny/project-utils/package.json");
const { getOutput, getEntry } = require("../../utils");
const { TsCheckerRspackPlugin } = require("ts-checker-rspack-plugin");
const { createSwcConfig } = require("./createSwcConfig");

const createRspackConfig = params => {
    const output = getOutput(params);
    const entry = getEntry(params);

    const { cwd, overrides, production, watch } = params;

    let swcConfig = createSwcConfig(cwd);

    // User overrides.
    if (typeof overrides.swc === "function") {
        swcConfig = overrides.swc(swcConfig);
    }

    const sourceMaps = params.sourceMaps !== false;

    const definitions = overrides.define ? JSON.parse(overrides.define) : {};
    const tsChecksEnabled = process.env.WEBINY_ENABLE_TS_CHECKS === "true";

    /** @type {import('@rspack/core').Configuration} */
    let rspackConfig = {
        watch,
        entry: [
            sourceMaps && require.resolve("source-map-support/register"),
            path.resolve(entry)
        ].filter(Boolean),
        target: "node",
        output: {
            libraryTarget: "commonjs",
            path: output.path,
            filename: output.filename,
            chunkFilename: `[name].[contenthash:8].chunk.js`
        },
        devtool: sourceMaps ? "source-map" : false,
        externals: [/^@aws-sdk/, /^sharp$/],
        mode: production ? "production" : "development",
        performance: {
            // Turn off size warnings for entry points
            hints: false
        },
        plugins: [
            tsChecksEnabled && new TsCheckerRspackPlugin(),

            // https://rspack.dev/plugins/webpack/define-plugin
            new rspack.DefinePlugin({
                "process.env.WEBINY_VERSION": JSON.stringify(process.env.WEBINY_VERSION || version),
                ...definitions
            }),

            // This is necessary to enable JSDOM usage in Lambda.
            // https://rspack.dev/plugins/webpack/ignore-plugin
            new rspack.IgnorePlugin({
                resourceRegExp: /canvas/,
                contextRegExp: /jsdom$/
            }),

            // https://rspack.dev/plugins/webpack/progress-plugin
            new rspack.ProgressPlugin()
        ].filter(Boolean),

        module: {
            rules: [
                {
                    oneOf: [
                        {
                            test: /\.mjs$/,
                            include: /node_modules/,
                            type: "javascript/auto",
                            resolve: {
                                fullySpecified: false
                            }
                        },
                        {
                            test: /\.(ts)$/,
                            loader: "builtin:swc-loader",
                            exclude: /node_modules/,
                            options: swcConfig
                        }
                    ].filter(Boolean)
                },
                /**
                 * Some NPM libraries import CSS automatically, and that breaks the build.
                 * To eliminate the problem, we use the `null-loader` to ignore CSS.
                 */
                {
                    test: /\.css$/,
                    loader: require.resolve("null-loader")
                }
            ]
        },
        resolve: {
            alias: {
                // Force `lexical` to use the CJS export.
                lexical: require.resolve("lexical")
            },
            modules: [path.resolve(path.join(cwd, "node_modules")), "node_modules"],
            extensions: [".ts", ".mjs", ".js", ".json", ".css"]
        }
    };

    // User overrides.
    if (typeof overrides.rspack === "function") {
        rspackConfig = overrides.rspack(rspackConfig);
    }

    return rspackConfig;
};

module.exports = { createRspackConfig };
