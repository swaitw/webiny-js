import React from "react";
import { ReactComponent as BackIcon } from "@material-design-icons/svg/round/arrow_back.svg";
import { useNavigateFolder } from "@webiny/app-aco";
import { IconButton } from "@webiny/ui/Button";
import { Typography } from "@webiny/ui/Typography";
import { useContentEntry } from "~/admin/views/contentEntries/hooks";
import {
    EntryMeta,
    EntryTitle,
    EntryVersion,
    TitleWrapper,
    EntryName
} from "./FullScreenContentEntry.styled";

export const FullScreenContentEntryHeaderLeft = () => {
    const { entry, contentModel } = useContentEntry();
    const { navigateToFolder, currentFolderId } = useNavigateFolder();

    const title = entry?.meta?.title || `New ${contentModel.name}`;
    const isNewEntry = !entry.meta?.title;
    const version = entry.meta?.version ?? null;
    const status = entry.meta?.status ?? null;

    return (
        <>
            <IconButton onClick={() => navigateToFolder(currentFolderId)} icon={<BackIcon />} />
            <TitleWrapper>
                <EntryMeta>
                    <Typography use="overline">
                        {`Model: ${contentModel.name} ${status ? `(status: ${status})` : ""}`}
                    </Typography>
                </EntryMeta>
                <EntryTitle>
                    <EntryName isNewEntry={isNewEntry}>{title}</EntryName>
                    {version && <EntryVersion>{`(v${version})`}</EntryVersion>}
                </EntryTitle>
            </TitleWrapper>
        </>
    );
};
