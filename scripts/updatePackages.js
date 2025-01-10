const { updatePackages, presets, getUserInput } = require("./updatePackagesLib/index");

(async () => {
    const input = await getUserInput({
        presets
    });
    if (!input) {
        return;
    }

    return updatePackages({
        input
    });
})();
