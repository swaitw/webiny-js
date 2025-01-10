import React, { createContext } from "react";
import { PbDataBinding, PbDataSource } from "~/types";

const passthrough = (cb: Updater<any>) => cb([]);

export const DynamicDocumentContext = createContext<{
    dataSources: PbDataSource[];
    dataBindings: PbDataBinding[];
    updateDataSources: (cb: Updater<PbDataSource>) => void;
    updateDataBindings: (cb: Updater<PbDataBinding>) => void;
}>({
    dataSources: [],
    dataBindings: [],
    updateDataBindings: passthrough,
    updateDataSources: passthrough
});

interface Props {
    children: React.ReactNode;
    dataSources: PbDataSource[];
    dataBindings: PbDataBinding[];
    onDataSources?: (dataSources: PbDataSource[]) => void;
    onDataBindings?: (dataBindings: PbDataBinding[]) => void;
}

export interface Updater<T> {
    (items: T[]): T[];
}

export const DynamicDocumentProvider = ({
    children,
    dataSources,
    dataBindings,
    onDataSources,
    onDataBindings
}: Props) => {
    const updateDataBindings = (cb: Updater<PbDataBinding>) => {
        if (onDataBindings) {
            onDataBindings(cb(dataBindings));
        }
    };

    const updateDataSources = (cb: Updater<PbDataSource>) => {
        if (onDataSources) {
            onDataSources(cb(dataSources));
        }
    };

    return (
        <DynamicDocumentContext.Provider
            value={{ dataSources, dataBindings, updateDataSources, updateDataBindings }}
        >
            {children}
        </DynamicDocumentContext.Provider>
    );
};
