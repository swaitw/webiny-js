import { VARIANT_SEPARATOR } from "./constants";

/**
 * We want to have stack name as env-variant.
 * If there is no variant sent, just env will be used - this is to maintain backward compatibility.
 */
export interface IGetStackNameParams {
    env: string;
    variant: string | undefined;
}

export const getStackName = ({ env, variant }: IGetStackNameParams) => {
    return [env, variant].filter(Boolean).join(VARIANT_SEPARATOR);
};

export const splitStackName = (stackName: string) => {
    const value = stackName.split(VARIANT_SEPARATOR);
    return {
        env: value[0],
        variant: value[1] || ""
    };
};
