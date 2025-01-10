import React, { useState, useCallback } from "react";
import { useSnackbar } from "@webiny/app-admin";
import { useRouter } from "@webiny/react-router";
import { CmsModel } from "@webiny/app-headless-cms/types";
import { CreatePageTemplateDialog } from "@webiny/app-page-builder/admin/views/PageTemplates/CreatePageTemplateDialog";
import { CreateTemplateDialog } from "~/admin/PageTemplateDialog/CreateTemplateDialog";
import { useCreateDynamicPageTemplate } from "~/features/pageTemplate/createDynamicTemplate/useCreateDynamicTemplate";

export const PageTemplateDialog = CreatePageTemplateDialog.createDecorator(Original => {
    return function CreatePageTemplateDialog(props) {
        const { history } = useRouter();
        const { showSnackbar } = useSnackbar();
        const { createDynamicPageTemplate } = useCreateDynamicPageTemplate();
        const [showStaticTemplateDialog, setShowStaticTemplateDialog] = useState(false);

        const createTemplate = useCallback(async (model: CmsModel) => {
            try {
                const template = await createDynamicPageTemplate(model);
                history.push(`/page-builder/template-editor/${template.id}`);
            } catch (error) {
                showSnackbar(error.message);
            }
        }, []);

        const onClose = useCallback(() => {
            setShowStaticTemplateDialog(false);
            props.onClose();
        }, [props.onClose]);

        return (
            <>
                <Original {...props} open={showStaticTemplateDialog} onClose={onClose} />
                <CreateTemplateDialog
                    open={props.open && !showStaticTemplateDialog}
                    onClose={props.onClose}
                    onDynamicTemplateSelect={createTemplate}
                    onStaticTemplateSelect={() => setShowStaticTemplateDialog(true)}
                    existingDynamicTemplateModelIds={[]}
                />
            </>
        );
    };
});
