import gql from "graphql-tag";
import { AcoAppMode, AcoModel } from "~/types";
import { createAppFields, ERROR_FIELD, LIST_META_FIELD } from "./common";
import { createListQuery } from "@webiny/app-headless-cms-common";

export const createListRecords = (model: AcoModel, mode: AcoAppMode, fieldIds: string[]) => {
    if (mode === "cms") {
        /**
         * We will include only the simplest fields.
         * TODO: remove default fields in a future release, as field selection will be injected by ACO configs.
         */
        const defaultFields = model.fields.filter(field => {
            return ["text", "number", "boolean", "file", "long-text", "ref", "datetime"].includes(
                field.type
            );
        });

        const additionalFields = model.fields.filter(field => {
            return fieldIds.includes(field.fieldId);
        });

        const uniqueFields = [
            ...new Map(
                [...defaultFields, ...additionalFields].map(field => [field.fieldId, field])
            ).values()
        ];

        return createListQuery(model, uniqueFields);
    }
    const { singularApiName, pluralApiName } = model;
    return gql`
        query List${pluralApiName}($where: ${singularApiName}ListWhereInput, $limit: Int, $after: String, $sort: [${singularApiName}ListSorter!], $search: String) {
            search {
                content: list${pluralApiName}(where: $where, limit: $limit, after: $after, sort: $sort, search: $search) {
                    data {
                        ${createAppFields(model)}
                    }
                    ${LIST_META_FIELD}
                    ${ERROR_FIELD}
                }
            }
        }
    `;
};
