const { SystemRequirements } = require("@webiny/system-requirements");

module.exports.getYarnVersion = async () => {
    return SystemRequirements.getYarnVersion();
};
