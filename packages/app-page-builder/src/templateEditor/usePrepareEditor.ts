import { useEffect, useState } from "react";
import { useRouter } from "@webiny/react-router";
import { useSnackbar } from "@webiny/app-admin";
import { PbPageTemplateWithContent } from "~/types";
import { createElement } from "~/editor/helpers";
import { usePageBlocks } from "~/admin/contexts/AdminPageBuilder/PageBlocks/usePageBlocks";
import { useListPageTemplates } from "~/features";
import { useSavedElements } from "~/templateEditor/prepareEditor/useSavedElements";
import { useBlockCategories } from "~/templateEditor/prepareEditor/useBlockCategories";

export const usePrepareEditor = (templateId: string) => {
    const { history } = useRouter();
    const { showSnackbar } = useSnackbar();
    const pageBlocks = usePageBlocks();
    const templates = useListPageTemplates();
    const [template, setTemplate] = useState<PbPageTemplateWithContent | undefined>(undefined);

    const savedElementsLoading = useSavedElements();
    const blockCategoriesLoading = useBlockCategories();

    useEffect(() => {
        pageBlocks.listBlocks();
    }, []);

    useEffect(() => {
        if (!templates.loading && templates.pageTemplates) {
            const template = templates.pageTemplates.find(tpl => tpl.id === templateId);
            if (!template) {
                history.push(`/page-builder/page-templates`);
                // TODO: replace with error snackbar after update from `next`
                showSnackbar("Template not found!");
                return;
            }

            const { content, ...restOfTemplateData } = template;

            setTemplate({
                ...restOfTemplateData,
                content: content || createElement("document")
            });
        }
    }, [templates.loading]);

    const loaders = [pageBlocks.loading, savedElementsLoading, blockCategoriesLoading, !template];

    return loaders.includes(true) ? undefined : template;
};
