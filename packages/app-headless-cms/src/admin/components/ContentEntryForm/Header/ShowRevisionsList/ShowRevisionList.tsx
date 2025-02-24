import React from "react";
import { ReactComponent as ListIcon } from "@material-design-icons/svg/outlined/checklist.svg";
import { ContentEntryEditorConfig } from "~/admin/config/contentEntries";
import { useFullScreenContentEntry } from "~/admin/views/contentEntries/ContentEntry/FullScreenContentEntry/useFullScreenContentEntry";

export const ShowRevisionList = () => {
    const { openRevisionList } = useFullScreenContentEntry();
    const { useOptionsMenuItem } = ContentEntryEditorConfig.Actions.MenuItemAction;
    const { OptionsMenuItem } = useOptionsMenuItem();

    return (
        <OptionsMenuItem
            icon={<ListIcon />}
            label={"Show entry revisions"}
            onAction={() => openRevisionList(true)}
            data-testid={"cms.content-form.header.show-revisions"}
        />
    );
};
