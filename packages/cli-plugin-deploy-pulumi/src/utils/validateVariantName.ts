import { IUserCommandInput } from "~/types";

const disallowedVariants = ["none", "empty", "blank"];

export const validateVariantName = (args: Pick<IUserCommandInput, "variant">): void => {
    const { variant } = args;
    if (!variant || disallowedVariants.includes(variant) === false) {
        return;
    }
    throw new Error(
        `Variant "${variant}" is not allowed. Please use a different variant name. Not allowed: ${disallowedVariants
            .map(v => {
                return `"${v}"`;
            })
            .join(", ")}.`
    );
};
