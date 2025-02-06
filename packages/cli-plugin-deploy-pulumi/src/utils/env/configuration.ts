import { IConfiguration, IConfigurationCb, IConfigurationCbParams } from "./types";

export interface ICreateConfigurationCallable {
    (params: IConfigurationCbParams): IConfiguration | undefined | null;
}

export interface ICreateConfiguration {
    (cb: ICreateConfigurationCallable): IConfigurationCb;
}

export const createConfiguration: ICreateConfiguration = cb => {
    return params => {
        return cb(params);
    };
};

export interface ICreateEnvParams {
    configurations: IConfigurationCb[];
}

export const createEnvConfiguration = (params: ICreateEnvParams): IConfiguration => {
    const { configurations } = params;
    if (configurations.length === 0) {
        throw new Error("At least one configuration must be provided.");
    }

    return configurations.reduce<IConfiguration>((collection, config) => {
        const previous = structuredClone(collection);
        const result = config({ previous });
        if (!result) {
            return previous;
        }
        return {
            ...previous,
            ...result
        };
    }, {});
};
