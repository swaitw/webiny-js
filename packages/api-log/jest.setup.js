const base = require("../../jest.config.base");
const presets = require("@webiny/project-utils/testing/presets")([]);

module.exports = {
    ...base({ path: __dirname }, presets)
};
