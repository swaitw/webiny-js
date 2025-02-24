import React, { useState, useCallback, SyntheticEvent, useEffect } from "react";
import { useSnackbar } from "@webiny/app-admin/hooks/useSnackbar";
import { Input } from "@webiny/ui/Input";
import { Tooltip } from "@webiny/ui/Tooltip";
import { TemplateTitle, templateTitleWrapper, TitleInputWrapper, TitleWrapper } from "./Styled";
import { useEventActionHandler } from "~/editor/hooks/useEventActionHandler";
import { UpdateDocumentActionEvent } from "~/editor/recoil/actions";
import { useTemplate } from "~/templateEditor/hooks/useTemplate";
import { PbPageTemplate } from "~/types";

declare global {
    interface Window {
        Cypress: any;
    }
}

export const Title = () => {
    const handler = useEventActionHandler();
    const [pageTemplate] = useTemplate();
    const { showSnackbar } = useSnackbar();
    const [editTitle, setEdit] = useState<boolean>(false);
    const [stateTitle, setTitle] = useState<string | null>(null);
    let title = stateTitle === null ? pageTemplate.title : stateTitle;

    useEffect(() => {
        if (pageTemplate.title && pageTemplate.title !== stateTitle) {
            setTitle(pageTemplate.title);
        }
    }, [pageTemplate.title]);

    const updateTemplate = (data: Partial<PbPageTemplate>) => {
        handler.trigger(
            new UpdateDocumentActionEvent({
                history: false,
                document: data,
                onFinish: () => {
                    showSnackbar(`Template title updated successfully!`);
                }
            })
        );
    };

    const enableEdit = useCallback(() => setEdit(true), []);

    const onBlur = useCallback(() => {
        if (title === "") {
            title = "Untitled";
            setTitle(title);
        }
        setEdit(false);
        updateTemplate({ title: title });
    }, [title]);

    const onKeyDown = useCallback(
        (e: SyntheticEvent) => {
            // @ts-expect-error
            switch (e.key) {
                case "Escape":
                    e.preventDefault();
                    setEdit(false);
                    setTitle(pageTemplate.title || "");
                    break;
                case "Enter":
                    if (title === "") {
                        title = "Untitled";
                        setTitle(title);
                    }

                    e.preventDefault();
                    setEdit(false);

                    updateTemplate({ title: title });
                    break;
                default:
                    return;
            }
        },
        [title, pageTemplate.title]
    );

    // Disable autoFocus because for some reason, blur event would automatically be triggered when clicking
    // on the template title when doing Cypress testing. Not sure if this is RMWC or Cypress related issue.
    const autoFocus = !window.Cypress;

    return editTitle ? (
        <TitleInputWrapper data-testid="pb-editor-page-title">
            <Input
                autoFocus={autoFocus}
                fullwidth
                value={title}
                onChange={setTitle}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
            />
        </TitleInputWrapper>
    ) : (
        <TitleWrapper>
            <div style={{ width: "100%", display: "flex" }}>
                <Tooltip
                    className={templateTitleWrapper}
                    placement={"bottom"}
                    content={<span>Rename</span>}
                >
                    <TemplateTitle data-testid="pb-editor-page-title" onClick={enableEdit}>
                        {title}
                    </TemplateTitle>
                </Tooltip>
            </div>
        </TitleWrapper>
    );
};
