import React, { ChangeEvent, useCallback, useState } from "react";
import { createRenderer } from "@webiny/app-page-builder-elements";
import { useDataSource } from "@webiny/app-page-builder/dataInjection";

export const EntriesSearchRenderer = createRenderer(() => {
    const data = useDataSource();
    const [value, setValue] = useState("");

    const onChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (!data) {
                return;
            }

            e.preventDefault();

            const value = e.target.value;

            setValue(value);

            data.loadData({
                search: value !== "" ? value : undefined
            });
        },
        [data]
    );

    return <input type={"text"} placeholder={"Search"} value={value} onChange={onChange} />;
});
