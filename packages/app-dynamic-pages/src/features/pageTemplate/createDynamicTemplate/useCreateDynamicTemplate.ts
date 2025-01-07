import { useCallback } from "react";
import slugify from "slugify";
import { CmsModel } from "@webiny/app-headless-cms/types";
import { useCreatePageTemplate } from "@webiny/app-page-builder/features";
import { useListDynamicTemplates } from "~/features/pageTemplate/listDynamicTemplates/useListDynamicTemplates";

export const useCreateDynamicPageTemplate = () => {
    const { dynamicTemplates } = useListDynamicTemplates();
    const { createPageTemplate } = useCreatePageTemplate();

    const createDynamicPageTemplate = useCallback(
        async (model: CmsModel) => {
            const existingDynamicTemplate = dynamicTemplates.find(template => {
                const dataSource = template.dataSources.find(ds => ds.name === "main");
                if (!dataSource) {
                    return false;
                }

                return dataSource.config.modelId === model.modelId;
            });

            if (existingDynamicTemplate) {
                return existingDynamicTemplate;
            }

            const templateSlug = slugify(model.name, {
                replacement: "-",
                lower: true,
                remove: /[*#\?<>_\{\}\[\]+~.()'"!:;@]/g,
                trim: false
            });

            return createPageTemplate({
                title: `${model.name} Page Template`,
                slug: templateSlug,
                description: "Dynamic page template",
                tags: [`model:${model.modelId}`],
                layout: "static",
                dataSources: [
                    {
                        name: "main",
                        type: "cms.entry",
                        config: {
                            modelId: model.modelId
                        }
                    }
                ],
                dataBindings: [
                    {
                        dataSource: "main",
                        bindFrom: "title",
                        bindTo: "page:title"
                    },
                    {
                        dataSource: "main",
                        bindFrom: "title",
                        bindTo: "page:settings.general.title"
                    }
                ]
            });
        },
        [dynamicTemplates]
    );

    return { createDynamicPageTemplate };
};
