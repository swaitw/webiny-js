import type { CmsGroupPlugin, CmsModelPlugin } from "@webiny/api-headless-cms";
import {
    createCmsGroupPlugin,
    createCmsModelPlugin,
    createSingleEntryModel
} from "@webiny/api-headless-cms";

export const createCmsModelPlugins = (): (CmsGroupPlugin | CmsModelPlugin)[] => {
    const group = createCmsGroupPlugin({
        id: "aTestGroupId",
        name: "A Test Group Name",
        icon: "icon",
        description: "A test description.",
        slug: "a-test-group-slug"
    });
    return [
        group,
        createCmsModelPlugin({
            modelId: "category",
            singularApiName: "Category",
            pluralApiName: "Categories",
            name: "Category",
            group: group.contentModelGroup,
            fields: [
                {
                    id: "title",
                    fieldId: "title",
                    label: "Title",
                    type: "text"
                }
            ],
            layout: [["title"]],
            description: "A test description.",
            titleFieldId: "title"
        }),
        createSingleEntryModel({
            modelId: "book",
            singularApiName: "Book",
            pluralApiName: "Books",
            name: "Book",
            group: group.contentModelGroup,
            fields: [
                {
                    id: "title",
                    fieldId: "title",
                    label: "Title",
                    type: "text"
                }
            ],
            layout: [["title"]],
            description: "A test description.",
            titleFieldId: "title"
        })
    ];
};
