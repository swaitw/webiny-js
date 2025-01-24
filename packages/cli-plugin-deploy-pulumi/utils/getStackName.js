const { VARIANT_SEPARATOR } = require("./constants");
/**
 * We want to have stack name as env-variant.
 * If there is no variant sent, just env will be used - this is to maintain backward compatibility.
 */
const getStackName = ({ env, variant }) => {
    return [env, variant].filter(Boolean).join(VARIANT_SEPARATOR);
};

const splitStackName = stackName => {
    const value = stackName.split(VARIANT_SEPARATOR);
    return {
        env: value[0],
        variant: value[1] || ""
    };
};

module.exports = {
    getStackName,
    splitStackName
};
