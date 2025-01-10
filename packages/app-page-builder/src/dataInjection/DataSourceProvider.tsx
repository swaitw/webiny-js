import React, { createContext, useMemo } from "react";
import { useLoadDataSource } from "~/features";
import { PbDataSource } from "~/types";
import type { GenericRecord } from "@webiny/app/types";
import { useDynamicDocument } from "./useDynamicDocument";
import { DataSourceDataProvider } from "./DataSourceDataProvider";

export interface PreviewDataProviderProps {
    dataSource: PbDataSource;
    children: React.ReactNode;
}

export interface DataSourceContext {
    data: GenericRecord;
    dataSource: PbDataSource;
    loadData: (params: GenericRecord) => void;
}

export const DataSourceContext = createContext<DataSourceContext | undefined>(undefined);

export const DataSourceProvider = ({ dataSource, children }: PreviewDataProviderProps) => {
    const { dataBindings } = useDynamicDocument();

    const paths = useMemo(() => {
        if (!dataSource) {
            return [];
        }

        const binds = dataBindings
            .filter(b => b.dataSource === dataSource.name)
            .map(binding => binding.bindFrom)
            .filter(path => path !== "*");

        return Array.from(new Set(binds)).sort();
    }, [dataSource, dataBindings]);

    const { data, loadData } = useLoadDataSource(dataSource, paths);

    return (
        <DataSourceContext.Provider value={{ dataSource, data, loadData }}>
            {/* TODO: Maybe this next provider is not necessary here? */}
            <DataSourceDataProvider dataSource={data || {}}>{children}</DataSourceDataProvider>
        </DataSourceContext.Provider>
    );
};
