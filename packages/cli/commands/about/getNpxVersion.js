const { SystemRequirements } = require("@webiny/system-requirements");

module.exports.getNpxVersion = async () => {
    return SystemRequirements.getNpxVersion();
};
