import WebinyError from "@webiny/error";
import lodashSortBy from "lodash.sortby";
import dotProp from "dot-prop";
import {
    CmsEntry,
    CmsEntryListWhere,
    CmsModel,
    CmsModelField
} from "@webiny/api-headless-cms/types";
import { Plugin } from "@webiny/plugins/types";
import { CmsFieldFilterPathPlugin, CmsFieldFilterValueTransformPlugin } from "~/types";
import { systemFields } from "./systemFields";
import { ValueFilterPlugin } from "@webiny/db-dynamodb/plugins/definitions/ValueFilterPlugin";
import { PluginsContainer } from "@webiny/plugins";

interface ModelField {
    def: CmsModelField;
    valueTransformer: (value: any) => any;
    valuePath: string;
    isSystemField?: boolean;
}

type ModelFieldRecords = Record<string, ModelField>;

interface CreateFiltersParams {
    plugins: PluginsContainer;
    where: CmsEntryListWhere;
    fields: ModelFieldRecords;
}

interface ItemFilter {
    fieldId: string;
    path: string;
    filterPlugin: ValueFilterPlugin;
    negate: boolean;
    compareValue: any;
    transformValue: <I = any, O = any>(value: I) => O;
}

export interface FilterItemFromStorage {
    (field: CmsModelField, value: any): Promise<any>;
}
interface FilterItemsParams {
    items: CmsEntry[];
    where: CmsEntryListWhere;
    plugins: PluginsContainer;
    fields: ModelFieldRecords;
    fromStorage: FilterItemFromStorage;
}

const VALUES_ATTRIBUTE = "values";

const extractWhereParams = (key: string) => {
    const result = key.split("_");
    const fieldId = result.shift();
    const rawOp = result.length === 0 ? "eq" : result.join("_");
    /**
     * When rawOp is not, it means it is equal negated so just return that.
     */
    if (rawOp === "not") {
        return {
            fieldId,
            operation: "eq",
            negate: true
        };
    }
    const negate = rawOp.match("not_") !== null;
    const operation = rawOp.replace("not_", "");
    return { fieldId, operation, negate };
};

const transformValue = (value: any, transform: (value: any) => any): any => {
    if (Array.isArray(value)) {
        return value.map(v => transform(v));
    }
    return transform(value);
};

const createFilters = (params: CreateFiltersParams): ItemFilter[] => {
    const { where, plugins, fields } = params;
    const filterPlugins = getMappedPlugins<ValueFilterPlugin>({
        plugins,
        type: ValueFilterPlugin.type,
        property: "operation"
    });
    const transformValuePlugins = getMappedPlugins<CmsFieldFilterValueTransformPlugin>({
        plugins,
        type: "cms-field-filter-value-transform",
        property: "fieldType"
    });
    const valuePathPlugins = getMappedPlugins<CmsFieldFilterPathPlugin>({
        plugins,
        type: "cms-field-filter-path",
        property: "fieldType"
    });
    return Object.keys(where).map(key => {
        const { fieldId, operation, negate } = extractWhereParams(key);

        const field: ModelField = fields[fieldId];
        if (!field) {
            throw new WebinyError(
                `There is no field with the fieldId "${fieldId}".`,
                "FIELD_ERROR",
                {
                    fieldId
                }
            );
        }

        const transformValuePlugin: CmsFieldFilterValueTransformPlugin =
            transformValuePlugins[field.def.type];
        const valuePathPlugin = valuePathPlugins[field.def.type];
        let targetValuePath: string;
        /**
         * add the base path if field is not a system field
         * pathPlugin should not know about that
         */
        const basePath = systemFields[fieldId] ? "" : `${VALUES_ATTRIBUTE}.`;
        if (valuePathPlugin) {
            targetValuePath = valuePathPlugin.createPath({
                field: field.def
            });
        } else if (systemFields[fieldId]) {
            targetValuePath = fieldId;
        } else {
            targetValuePath = field.def.fieldId;
        }

        const valuePath = `${basePath}${targetValuePath}`;

        const filterPlugin = filterPlugins[operation];
        if (!filterPlugin) {
            throw new WebinyError(
                `There is no filter plugin for operation "${operation}".`,
                "FILTER_PLUGIN_ERROR",
                {
                    operation
                }
            );
        }

        const transformValueCallable = (value: any) => {
            if (!transformValuePlugin) {
                return value;
            }
            return transformValuePlugin.transform({
                field: field.def,
                value
            });
        };

        return {
            fieldId,
            path: valuePath,
            filterPlugin,
            negate,
            compareValue: transformValue(where[key], transformValueCallable),
            transformValue: transformValueCallable
        };
    });
};

export const filterItems = async (params: FilterItemsParams): Promise<CmsEntry[]> => {
    const { items, where, plugins, fields, fromStorage } = params;

    const filters = createFilters({
        plugins,
        where,
        fields
    });
    const results: CmsEntry[] = [];

    for (const key in items) {
        if (items.hasOwnProperty(key) === false) {
            continue;
        }
        const item = items[key];

        let passed = true;
        for (const filter of filters) {
            const rawValue = dotProp.get(item, filter.path);

            const plainValue = await fromStorage(fields[filter.fieldId].def, rawValue);
            /**
             * If raw value is not same as the value after the storage transform, set the value to the items being filtered.
             */
            if (plainValue !== rawValue) {
                items[key] = dotProp.set(item, filter.path, plainValue);
            }

            const value = transformValue(plainValue, filter.transformValue);
            const matched = filter.filterPlugin.matches({
                value,
                compareValue: filter.compareValue
            });
            if ((filter.negate ? !matched : matched) === false) {
                passed = false;
                break;
            }
        }
        if (!passed) {
            continue;
        }
        results.push(item);
    }
    return results;

    // return items.filter(item => {
    //     for (const filter of filters) {
    //         const plainValue = await fromStorage(
    //             fields[filter.fieldId].def,
    //             dotProp.get(item, filter.path)
    //         );
    //
    //         const value = transformValue(plainValue, filter.transformValue);
    //         const matched = filter.filterPlugin.matches({
    //             value,
    //             compareValue: filter.compareValue
    //         });
    //         if ((filter.negate ? !matched : matched) === false) {
    //             return false;
    //         }
    //     }
    //     return true;
    // });
};

const extractSort = (
    sortBy: string,
    fields: ModelFieldRecords
): { valuePath: string; reverse: boolean; fieldId: string } => {
    const result = sortBy.split("_");
    if (result.length !== 2) {
        throw new WebinyError(
            "Problem in determining the sorting for the entry items.",
            "SORT_ERROR",
            {
                sortBy
            }
        );
    }
    const [fieldId, order] = result;

    const modelField = fields[fieldId];

    if (!modelField) {
        throw new WebinyError(
            "Sorting field does not exist in the content model.",
            "SORTING_FIELD_ERROR",
            {
                fieldId,
                fields
            }
        );
    }
    const valuePath = modelField.valuePath;
    return {
        fieldId,
        valuePath,
        reverse: order === "DESC"
    };
};

interface SortEntryItemsArgs {
    items: CmsEntry[];
    sort: string[];
    fields: ModelFieldRecords;
}

export const sortEntryItems = (params: SortEntryItemsArgs): CmsEntry[] => {
    const { items, sort = [], fields } = params;
    if (items.length <= 1) {
        return items;
    } else if (sort.length === 0) {
        sort.push("savedOn_DESC");
    } else if (sort.length > 1) {
        throw new WebinyError("Sorting is limited to a single field.", "SORT_ERROR", {
            sort: sort
        });
    }
    const [firstSort] = sort;
    if (!firstSort) {
        throw new WebinyError("Empty sort array item.", "SORT_ERROR", {
            sort
        });
    }

    const { fieldId, valuePath, reverse } = extractSort(firstSort, fields);
    const field = fields[fieldId];

    const itemsToSort = items.map(item => {
        return {
            id: item.id,
            value: field.valueTransformer(dotProp.get(item, valuePath))
        };
    });
    const sortedItems: { id: string; value: any }[] = lodashSortBy(itemsToSort, "value");
    const newItems = sortedItems.map(s => {
        const item = items.find(i => i.id === s.id);
        if (item) {
            return item;
        }
        throw new WebinyError(
            "Could not find item by given id after the sorting.",
            "SORTING_ITEMS_ERROR",
            {
                id: s.id,
                sortingBy: fieldId,
                reverse
            }
        );
    });
    if (!reverse) {
        return newItems;
    }
    return newItems.reverse();
};

const getMappedPlugins = <T extends Plugin>(params: {
    plugins: PluginsContainer;
    type: string;
    property: string;
}): Record<string, T> => {
    const { plugins: pluginsContainer, type, property } = params;
    const plugins = pluginsContainer.byType<T>(type);
    if (plugins.length === 0) {
        throw new WebinyError(`There are no plugins of type "${type}".`, "PLUGINS_ERROR", {
            type
        });
    }
    return plugins.reduce((collection, plugin) => {
        const key = plugin[property];
        if (typeof key !== "string") {
            throw new WebinyError(
                "Property to map the plugins on must be a string.",
                "PLUGIN_PROPERTY_ERROR",
                {
                    type,
                    property
                }
            );
        }
        collection[key] = plugin;
        return collection;
    }, {});
};

export const buildModelFields = ({
    plugins,
    model
}: {
    plugins: PluginsContainer;
    model: CmsModel;
}) => {
    const transformValuePlugins = getMappedPlugins<CmsFieldFilterValueTransformPlugin>({
        plugins,
        type: "cms-field-filter-value-transform",
        property: "fieldType"
    });
    const valuePathPlugins = getMappedPlugins<CmsFieldFilterPathPlugin>({
        plugins,
        type: "cms-field-filter-path",
        property: "fieldType"
    });
    const fields: ModelFieldRecords = Object.values(systemFields).reduce((collection, field) => {
        const transformValuePlugin = transformValuePlugins[field.type];
        const valuePathPlugin = valuePathPlugins[field.type];
        let valuePath: string;
        if (valuePathPlugin) {
            valuePath = valuePathPlugin.createPath({
                field
            });
        }
        collection[field.fieldId] = {
            def: field,
            valueTransformer: (value: any) => {
                if (!transformValuePlugin) {
                    return value;
                }
                return transformValuePlugin.transform({ field, value });
            },
            valuePath: valuePath || field.fieldId,
            isSystemField: true
        };

        return collection;
    }, {} as ModelFieldRecords);

    return model.fields.reduce((collection, field) => {
        const transformValuePlugin = transformValuePlugins[field.type];
        const valuePathPlugin = valuePathPlugins[field.type];
        let valuePath: string;
        if (valuePathPlugin) {
            valuePath = valuePathPlugin.createPath({
                field
            });
        }
        const targetValuePath = `${VALUES_ATTRIBUTE}.${valuePath || field.fieldId}`;
        collection[field.fieldId] = {
            def: field,
            valueTransformer: (value: any) => {
                if (!transformValuePlugin) {
                    return value;
                }
                return transformValuePlugin.transform({ field, value });
            },
            valuePath: targetValuePath || field.fieldId
        };

        return collection;
    }, fields);
};
