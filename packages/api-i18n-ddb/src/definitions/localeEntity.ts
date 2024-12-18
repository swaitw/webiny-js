import type { Table } from "@webiny/db-dynamodb/toolbox";
import type { I18NContext } from "@webiny/api-i18n/types";
import { getExtraAttributesFromPlugins } from "@webiny/db-dynamodb/utils/attributes";
import type { IEntity } from "@webiny/db-dynamodb";
import { createEntity } from "@webiny/db-dynamodb";

export interface ILocaleEntityParams {
    context: I18NContext;
    table: Table<string, string, string>;
}

export default (params: ILocaleEntityParams): IEntity => {
    const { context, table } = params;
    const entityName = "I18NLocale";
    const attributes = getExtraAttributesFromPlugins(context.plugins, entityName);
    return createEntity({
        name: entityName,
        table,
        attributes: {
            PK: {
                partitionKey: true
            },
            SK: {
                sortKey: true
            },
            createdOn: {
                type: "string"
            },
            createdBy: {
                type: "map"
            },
            code: {
                type: "string"
            },
            default: {
                type: "boolean"
            },
            webinyVersion: {
                type: "string"
            },
            tenant: {
                type: "string"
            },
            ...attributes
        }
    });
};
