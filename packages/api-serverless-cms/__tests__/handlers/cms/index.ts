import { createCmsModelPlugins } from "./models";

export const createCmsPlugins = () => {
    return [...createCmsModelPlugins()];
};
