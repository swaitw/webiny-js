import { createPreset } from "../createPreset";

export const fastify = createPreset(() => {
    return {
        name: "fastify",
        matching: /^@fastify\/|^fastify/,
        skipResolutions: true,
        caret: false
    };
});
