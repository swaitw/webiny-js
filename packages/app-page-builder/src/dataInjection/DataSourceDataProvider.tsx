import React, { createContext, useContext } from "react";
import type { GenericRecord } from "@webiny/app/types";

const Context = createContext<{ dataSource: GenericRecord }>({ dataSource: {} });

interface Props {
    children: React.ReactNode;
    dataSource: GenericRecord;
}

export const DataSourceDataProvider = ({ children, dataSource }: Props) => {
    return <Context.Provider value={{ dataSource }}>{children}</Context.Provider>;
};

export const useDataSourceData = () => {
    const { dataSource } = useContext(Context);

    return { data: dataSource };
};
