import { Plugin } from "@webiny/plugins/types";
import { createGraphQlPlugin } from "~/graphql/plugin";

export interface ICreateGraphQlParams {
    createGraphQL?: boolean;
}

export const createGraphQl = (params?: ICreateGraphQlParams): Plugin[] => {
    /**
     * If the `createGraphQl` flag is set to `true` or debug mode is enabled, we'll create the GraphQL plugin.
     */
    const debug = [params?.createGraphQL === true, process.env.DEBUG === "true"].some(Boolean);
    if (!debug) {
        return [];
    }

    return [createGraphQlPlugin()];
};
