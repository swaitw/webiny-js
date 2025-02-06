import { createConfiguration } from "./configuration";
import { regions } from "@webiny/cli/regions";

export interface IWithRegionParams {
    region: string | undefined;
}

export const withRegion = (params: IWithRegionParams) => {
    return createConfiguration(() => {
        const { region } = params;
        if (!region) {
            return;
        }
        const exists = regions.some(item => item.value === region);
        if (!exists) {
            throw new Error(`Webiny does not support region "${region}".`);
        }
        return {
            AWS_REGION: region
        };
    });
};
