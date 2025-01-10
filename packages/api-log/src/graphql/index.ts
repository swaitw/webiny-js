import { Plugin } from "@webiny/plugins/types";
import { createGraphQlPlugin } from "~/graphql/plugin";

export const createGraphQl = (): Plugin[] => {
    if (process.env.DEBUG !== "true") {
        return [];
    }

    return [createGraphQlPlugin()];
};
