import { createPreset } from "../createPreset";

export const rmwc = createPreset(() => {
    return {
        name: "rmwc",
        matching: /^@rmwc/,
        skipResolutions: true,
        caret: true
    };
});
