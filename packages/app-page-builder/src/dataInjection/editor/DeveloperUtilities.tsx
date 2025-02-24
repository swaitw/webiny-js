import { useEffect } from "react";
import { PbDataBinding } from "~/types";
import { useDynamicDocument } from "~/dataInjection";

export const DeveloperUtilities = () => {
    const { dataSources, dataBindings, updateDataBindings } = useDynamicDocument();

    useEffect(() => {
        // @ts-expect-error This is a developers-only utility.
        window["debug_resetBindings"] = () => {
            updateDataBindings(() => []);
        };

        // @ts-expect-error This is a developers-only utility.
        window["debug_printBindings"] = () => {
            console.log(dataBindings);
        };

        // @ts-expect-error This is a developers-only utility.
        window["debug_printDataSources"] = () => {
            console.log(dataSources);
        };

        // @ts-expect-error This is a developers-only utility.
        window["debug_refreshBindings"] = () => {
            updateDataBindings(dataBindings => {
                const uniqueBindings: PbDataBinding[] = [];

                dataBindings.forEach(db => {
                    if (
                        !uniqueBindings.some(
                            b => b.dataSource === db.dataSource && b.bindTo === db.bindTo
                        )
                    ) {
                        uniqueBindings.push(db);
                    }
                });

                return uniqueBindings;
            });
        };
    }, [dataSources, dataBindings]);

    return null;
};
