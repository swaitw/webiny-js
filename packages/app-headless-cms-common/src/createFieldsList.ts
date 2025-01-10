import { CmsModel, CmsModelField, CmsModelFieldTypePlugin } from "~/types";
import { plugins } from "@webiny/plugins";

interface CreateFieldsListParams {
    model: CmsModel;
    fields: CmsModelField[];
    graphQLTypePrefix?: string;
}

export function createFieldsList({
    model,
    fields: inputFields,
    graphQLTypePrefix
}: CreateFieldsListParams): string {
    const fieldPlugins: Record<string, CmsModelFieldTypePlugin["field"]> = plugins
        .byType<CmsModelFieldTypePlugin>("cms-editor-field-type")
        .reduce((acc, item) => ({ ...acc, [item.field.type]: item.field }), {});

    const typePrefix = graphQLTypePrefix ?? model.singularApiName;

    const fields = inputFields
        .map(field => {
            if (!fieldPlugins[field.type]) {
                console.log(`Unknown field plugin for field type "${field.type}".`);
                return null;
            }
            const { graphql } = fieldPlugins[field.type];

            if (graphql && graphql.queryField) {
                const { queryField } = graphql;
                const selection =
                    typeof queryField === "string"
                        ? queryField
                        : queryField({ model, field, graphQLTypePrefix: typePrefix });

                /**
                 * If field type plugin returns `null`, we don't include the field in the selection.
                 */
                if (selection === null) {
                    return null;
                }

                return `${field.fieldId} ${selection}`;
            }

            return field.fieldId;
        })
        .filter(Boolean);
    /**
     * If there are no fields, let's always load the `id` field.
     */
    if (fields.length === 0) {
        fields.push("id");
    }
    return fields.join("\n");
}
