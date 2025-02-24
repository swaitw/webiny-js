import type { PbDataSource } from "@webiny/app-page-builder/types";

export const hasMainDataSource = (dataSources: PbDataSource[]): boolean => {
    return dataSources.some(source => source.name === "main");
};
