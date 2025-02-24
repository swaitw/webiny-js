const { SystemRequirements } = require("@webiny/system-requirements");

module.exports.getNpmVersion = async () => {
    return SystemRequirements.getNpmVersion();
};
