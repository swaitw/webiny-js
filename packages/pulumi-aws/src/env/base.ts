export interface ICreateGetEnvParams<T = unknown> {
    name: string;
    defaultValue: T;
}

/**
 * TODO @adrian @pavel verify please
 *
 *
 * We do not allow env with name "undefined" or "null". It is considered as an empty string.
 * Sometimes, when setting env variable, a user error might set it to "undefined" or "null" value by mistake.
 *
 * We doubt that undefined and null are what users meant to set as the value of the environment variable.
 */
export const createGetEnv = (params: Pick<ICreateGetEnvParams, "name">) => {
    return (): string => {
        const value = process.env[params.name];
        if (!value?.length || value === "undefined" || value === "null") {
            throw new Error(`Missing ${params.name} environment variable.`);
        }
        return value;
    };
};

export const createGetEnvOptional = <T>(params: ICreateGetEnvParams<T>) => {
    return (): string | T => {
        const value = process.env[params.name];
        if (!value?.length || value === "undefined" || value === "null") {
            return params.defaultValue;
        }
        return value;
    };
};
