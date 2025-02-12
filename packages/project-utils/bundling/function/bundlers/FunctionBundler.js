const { BaseFunctionBundler } = require("./BaseFunctionBundler");

class FunctionBundler extends BaseFunctionBundler {
    constructor(params) {
        super();
        this.params = params;
    }

    build() {
        const BundlerClass = this.getBundlerClass();
        const bundler = new BundlerClass(this.params);
        return bundler.build();
    }

    watch() {
        const Bundler = this.getBundlerClass();
        return new Bundler(this.params).watch();
    }

    getBundlerClass() {
        const { featureFlags } = require("@webiny/feature-flags");
        if (featureFlags.rspack) {
            const { RspackBundler } = require("./RspackBundler");
            return RspackBundler;
        }

        const { WebpackBundler } = require("./WebpackBundler");
        return WebpackBundler;
    }
}

module.exports = { FunctionBundler };
