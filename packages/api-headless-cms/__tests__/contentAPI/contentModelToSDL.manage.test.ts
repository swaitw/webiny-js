import prettier from "prettier";
import contentModels from "./mocks/contentModels";
import { createGraphQLFields } from "~/graphqlFields";
import categoryManage from "./snapshots/category.manage";
import productManage from "./snapshots/product.manage";
import reviewManage from "./snapshots/review.manage";
import { CmsModel, CmsModelFieldToGraphQLPlugin } from "~/types";
import { createManageSDL } from "~/graphql/schema/createManageSDL";
import { pageModel } from "./mocks/pageWithDynamicZonesModel";
import pageManage from "./snapshots/page.manage";

describe("MANAGE - ContentModel to SDL", () => {
    const fieldTypePlugins = createGraphQLFields().reduce<
        Record<string, CmsModelFieldToGraphQLPlugin>
    >((acc, pl) => {
        acc[pl.fieldType] = pl;
        return acc;
    }, {});

    const models = [...contentModels];

    test("Category SDL", async () => {
        const model = contentModels.find(c => c.modelId === "category") as CmsModel;
        const sdl = createManageSDL({ models, model, fieldTypePlugins, sorterPlugins: [] });
        const prettyGql = await prettier.format(sdl.trim(), { parser: "graphql" });
        const prettySnapshot = await prettier.format(categoryManage.trim(), { parser: "graphql" });
        expect(prettyGql).toBe(prettySnapshot);
    });

    test("Product SDL", async () => {
        const model = contentModels.find(c => c.modelId === "product") as CmsModel;
        const sdl = createManageSDL({ models, model, fieldTypePlugins, sorterPlugins: [] });
        const prettyGql = await prettier.format(sdl.trim(), { parser: "graphql" });
        const prettySnapshot = await prettier.format(productManage.trim(), { parser: "graphql" });
        expect(prettyGql).toBe(prettySnapshot);
    });

    test("Review SDL", async () => {
        const model = contentModels.find(c => c.modelId === "review") as CmsModel;
        const sdl = createManageSDL({ models, model, fieldTypePlugins, sorterPlugins: [] });
        const prettyGql = await prettier.format(sdl.trim(), { parser: "graphql" });
        const prettySnapshot = await prettier.format(reviewManage.trim(), { parser: "graphql" });
        expect(prettyGql).toBe(prettySnapshot);
    });

    test("Dynamic Zone SDL", async () => {
        const sdl = createManageSDL({
            models,
            model: pageModel as CmsModel,
            fieldTypePlugins,
            sorterPlugins: []
        });
        const prettyGql = await prettier.format(sdl.trim(), { parser: "graphql" });
        const prettySnapshot = await prettier.format(pageManage.trim(), { parser: "graphql" });
        expect(prettyGql).toBe(prettySnapshot);
    });
});
