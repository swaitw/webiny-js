import zod from "zod";

export const dynamicData = {
    dataSources: zod
        .array(
            zod.object({
                name: zod.string(),
                type: zod.string(),
                config: zod.object({}).passthrough()
            })
        )
        .optional(),
    dataBindings: zod
        .array(
            zod.object({
                dataSource: zod.string(),
                bindFrom: zod.string(),
                bindTo: zod.string()
            })
        )
        .optional()
};
