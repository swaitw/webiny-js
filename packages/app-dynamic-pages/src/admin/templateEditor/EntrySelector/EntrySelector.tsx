import React, { useState } from "react";
import { Input } from "@webiny/ui/Input";
import { useDocumentDataSource } from "@webiny/app-page-builder/templateEditor";

export const EntrySelector = () => {
    const { getDataSource, updateDataSource } = useDocumentDataSource();
    const mainDataSource = getDataSource("main");
    const [localId, setLocalId] = useState(mainDataSource ? mainDataSource.config.entryId : "");

    const applyPreviewId = () => {
        updateDataSource("main", config => {
            return {
                ...config,
                entryId: localId
            };
        });
    };

    return (
        <Input
            value={localId}
            onChange={setLocalId}
            onBlur={applyPreviewId}
            placeholder={"Preview Entry Id"}
        />
    );
};
