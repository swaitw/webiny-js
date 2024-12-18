import type { Table } from "@webiny/db-dynamodb/toolbox";
import type { I18NContext } from "@webiny/api-i18n/types";
import { getExtraAttributesFromPlugins } from "@webiny/db-dynamodb/utils/attributes";
import type { IEntity } from "@webiny/db-dynamodb";
import { createEntity } from "@webiny/db-dynamodb";

export default (params: {
    context: Pick<I18NContext, "plugins">;
    table: Table<string, string, string>;
}): IEntity => {
    const { context, table } = params;
    const entityName = "I18NSystem";
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
            version: {
                type: "string"
            },
            tenant: {
                type: "string"
            },
            ...attributes
        }
    });
};
