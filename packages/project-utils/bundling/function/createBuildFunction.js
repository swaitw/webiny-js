const { prepareOptions } = require("../../utils");

module.exports = config => async options => {
    const preparedOptions = prepareOptions({ config, options });
    const { FunctionBundler } = require("./bundlers/FunctionBundler");
    const bundler = new FunctionBundler(preparedOptions);
    return bundler.build();
};
