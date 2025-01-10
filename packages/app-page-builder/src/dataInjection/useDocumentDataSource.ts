import { useCallback, useEffect } from "react";
import { PbDataSource } from "~/types";
import { useDynamicDocument } from "~/dataInjection/useDynamicDocument";

export interface DataSourceUpdater {
    (config: PbDataSource["config"]): PbDataSource["config"];
}

export const useDocumentDataSource = () => {
    const { dataSources, dataBindings, updateDataSources } = useDynamicDocument();
    const key = JSON.stringify(dataSources);

    useEffect(() => {
        console.log({ dataSources, dataBindings });
    }, [JSON.stringify(dataSources), JSON.stringify(dataBindings)]);

    const getDataSource = useCallback(
        (name: string) => {
            return dataSources.find(ds => ds.name === name);
        },
        [key]
    );

    const createDataSource = useCallback(
        (dataSource: PbDataSource) => {
            updateDataSources(sources => {
                return [...sources, dataSource];
            });
        },
        [key]
    );

    const updateDataSource = useCallback(
        (name: string, updater: DataSourceUpdater) => {
            const dataSource = dataSources.find(ds => ds.name === name);
            if (!dataSource) {
                return;
            }

            const updatedConfig = updater(dataSource.config);

            updateDataSources(dataSources => {
                const dsIndex = dataSources.findIndex(ds => ds.name === name);

                return [
                    ...dataSources.slice(0, dsIndex),
                    { ...dataSources[dsIndex], config: updatedConfig },
                    ...dataSources.slice(dsIndex + 1)
                ];
            });
        },
        [key]
    );

    const deleteDataSource = useCallback(
        (name: string) => {
            updateDataSources(dataSources => {
                return dataSources.filter(ds => ds.name !== name);
            });
        },
        [key]
    );

    return { getDataSource, createDataSource, updateDataSource, deleteDataSource };
};
