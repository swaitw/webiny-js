import React, { useCallback, useEffect, useState } from "react";
import { useActiveElement, EditorConfig } from "~/editor";
import type { PbEditorElement, PbDataSource } from "~/types";
import { DelayedOnChange } from "@webiny/ui/DelayedOnChange";
import { Input } from "@webiny/ui/Input";
import { OnElementType } from "./OnElementType";
import { useGetElementDataSource } from "./useGetElementDataSource";
import { useDocumentDataSource } from "~/dataInjection";

const { Ui } = EditorConfig;

interface ValueFormatter {
    (value: string): unknown;
}

export interface DataSourceConfigInputProps {
    elementType: string;
    configName: string;
    label: string;
    format?: ValueFormatter;
}

const defaultFormat: ValueFormatter = (value: string) => value;

export const DataSourceConfigInput = ({
    elementType,
    configName,
    format = defaultFormat,
    label
}: DataSourceConfigInputProps) => {
    return (
        <Ui.Sidebar.Element
            name={`dataSourceConfig:${elementType}:${configName}`}
            group={"dataSettings"}
            element={
                <OnElementType elementType={elementType}>
                    <ConfigInputUi configName={configName} label={label} format={format} />
                </OnElementType>
            }
        />
    );
};

interface ConfigInputUiProps {
    configName: string;
    label: string;
    format: ValueFormatter;
}

const ConfigInputUi = ({ configName, label, format }: ConfigInputUiProps) => {
    const [element] = useActiveElement<PbEditorElement>();
    const { updateDataSource } = useDocumentDataSource();
    const { getElementDataSource } = useGetElementDataSource();
    const [value, setValue] = useState("");
    const [dataSource, setDataSource] = useState<PbDataSource | undefined>(undefined);

    useEffect(() => {
        getElementDataSource(element).then(dataSource => {
            const value = dataSource ? dataSource.config[configName] : "";
            setValue(value);
            setDataSource(dataSource);
        });
    }, [element.id]);

    const onChange = useCallback(
        async (value: string) => {
            if (!dataSource) {
                return;
            }

            updateDataSource(dataSource.name, config => {
                return {
                    ...config,
                    [configName]: format(value)
                };
            });
        },
        [updateDataSource, configName, dataSource?.name]
    );

    return (
        <DelayedOnChange value={value} onChange={onChange}>
            {({ value, onChange }) => <Input label={label} value={value} onChange={onChange} />}
        </DelayedOnChange>
    );
};
