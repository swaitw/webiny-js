import React from "react";
// @ts-expect-error
import { useHotkeys } from "react-hotkeyz";
import { DrawerContent } from "@webiny/ui/Drawer";
import { RevisionsList } from "~/admin/views/contentEntries/ContentEntry/RevisionsList/RevisionsList";
import { cmsLegacyEntryEditor } from "~/utils/cmsLegacyEntryEditor";
import { useFullScreenContentEntry } from "../useFullScreenContentEntry";
import { Header } from "./Header";
import { Drawer } from "./RevisionListDrawer.styled";

export const RevisionListDrawer = () => {
    const { isRevisionListOpen, openRevisionList } = useFullScreenContentEntry();

    if (cmsLegacyEntryEditor) {
        return null;
    }

    useHotkeys({
        zIndex: 55,
        disabled: !isRevisionListOpen,
        keys: {
            esc: () => openRevisionList(false)
        }
    });

    return (
        <Drawer open={isRevisionListOpen} onClose={() => openRevisionList(false)} modal dismissible>
            <DrawerContent>
                <Header onClose={() => openRevisionList(false)} />
                <RevisionsList />
            </DrawerContent>
        </Drawer>
    );
};
