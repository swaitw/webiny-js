import { useListPageTemplates } from "@webiny/app-page-builder/features";
import { hasMainDataSource } from "~/features";

export const useListDynamicTemplates = () => {
    const { pageTemplates } = useListPageTemplates();

    const dynamicTemplates = pageTemplates.filter(template =>
        hasMainDataSource(template.dataSources)
    );

    return { dynamicTemplates };
};
