import { useCallback, useEffect } from "react";
import { useTemplate } from "./useTemplate";
import { PbDataSource } from "~/types";

export interface DataSourceUpdater {
    (config: PbDataSource["config"]): PbDataSource["config"];
}

export const useDocumentDataSource = () => {
    const [template, updateTemplate] = useTemplate();
    const dataSources = template.dataSources;
    const key = JSON.stringify(dataSources);

    useEffect(() => {
        console.log({ dataSources: template.dataSources, dataBindings: template.dataBindings });
    }, [JSON.stringify(template)]);

    const getDataSource = useCallback(
        (name: string) => {
            return dataSources.find(ds => ds.name === name);
        },
        [key]
    );

    const createDataSource = useCallback(
        (dataSource: PbDataSource) => {
            updateTemplate(template => {
                return {
                    ...template,
                    dataSources: [...template.dataSources, dataSource]
                };
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

            updateTemplate(template => {
                const dsIndex = template.dataSources.findIndex(ds => ds.name === name);

                return {
                    ...template,
                    dataSources: [
                        ...template.dataSources.slice(0, dsIndex),
                        { ...template.dataSources[dsIndex], config: updatedConfig },
                        ...template.dataSources.slice(dsIndex + 1)
                    ]
                };
            });
        },
        [key]
    );

    const deleteDataSource = useCallback(
        (name: string) => {
            updateTemplate(template => {
                return {
                    ...template,
                    dataSources: template.dataSources.filter(ds => ds.name !== name)
                };
            });
        },
        [key]
    );

    return { getDataSource, createDataSource, updateDataSource, deleteDataSource };
};
