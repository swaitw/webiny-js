const { createWatchPackage, createBuildPackage } = require("@webiny/project-utils");
const fsExtra = require("fs-extra");
const path = require("path");

module.exports = {
    commands: {
        build: async options => {
            const cb = createBuildPackage({ cwd: __dirname });
            const result = await cb(options);
            /**
             * We need to copy template into dist so it is published to npm.
             */
            const from = path.resolve(__dirname, "template");
            const to = path.resolve(__dirname, "dist/template");
            await fsExtra.copy(from, to);

            return result;
        },
        watch: createWatchPackage({ cwd: __dirname })
    }
};
