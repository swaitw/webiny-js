import WebinyError from "@webiny/error";
import { operatorPluginsList } from "./operatorPluginsList";
import { transformValueForSearch } from "./transformValueForSearch";
import { searchPluginsList } from "./searchPluginsList";
import {
    CmsEntryListParams,
    CmsEntryListSort,
    CmsEntryListWhere,
    CmsModel
} from "@webiny/api-headless-cms/types";
import { ElasticsearchQueryBuilderValueSearchPlugin } from "~/types";
import {
    SearchBody as esSearchBody,
    Sort as esSort,
    ElasticsearchBoolQueryConfig
} from "@webiny/api-elasticsearch/types";
import { decodeCursor } from "@webiny/api-elasticsearch/cursors";
import { createSort } from "@webiny/api-elasticsearch/sort";
import { createModelFields, ModelField, ModelFields } from "./fields";
import { CmsEntryElasticsearchFieldPlugin } from "~/plugins/CmsEntryElasticsearchFieldPlugin";
import { parseWhereKey } from "@webiny/api-elasticsearch/where";
import { PluginsContainer } from "@webiny/plugins";
import { createLatestType, createPublishedType } from "~/operations/entry";
import { CmsEntryElasticsearchQueryModifierPlugin } from "~/plugins/CmsEntryElasticsearchQueryModifierPlugin";
import { CmsEntryElasticsearchSortModifierPlugin } from "~/plugins/CmsEntryElasticsearchSortModifierPlugin";
import { CmsEntryElasticsearchBodyModifierPlugin } from "~/plugins/CmsEntryElasticsearchBodyModifierPlugin";

interface CreateElasticsearchParams {
    plugins: PluginsContainer;
    model: CmsModel;
    args: CmsEntryListParams;
    parentPath?: string;
}

interface CreateElasticsearchSortParams {
    plugins: PluginsContainer;
    sort?: CmsEntryListSort;
    modelFields: ModelFields;
    parentPath?: string;
    model: CmsModel;
    searchPlugins: Record<string, ElasticsearchQueryBuilderValueSearchPlugin>;
}

interface CreateElasticsearchQueryArgs {
    model: CmsModel;
    plugins: PluginsContainer;
    where: CmsEntryListWhere;
    modelFields: ModelFields;
    parentPath?: string;
    searchPlugins: Record<string, ElasticsearchQueryBuilderValueSearchPlugin>;
}

const specialFields = ["published", "latest", "locale", "tenant"];
const noKeywordFields = ["date", "number", "boolean"];

const createElasticsearchSortParams = (args: CreateElasticsearchSortParams): esSort => {
    const { sort, modelFields, parentPath, searchPlugins } = args;

    if (!sort || sort.length === 0) {
        return undefined;
    }

    const sortPlugins: Record<string, CmsEntryElasticsearchFieldPlugin> = Object.values(
        modelFields
    ).reduce((plugins, modelField) => {
        const searchPlugin = searchPlugins[modelField.type];

        plugins[modelField.field.fieldId] = new CmsEntryElasticsearchFieldPlugin({
            unmappedType: modelField.unmappedType,
            keyword: hasKeyword(modelField),
            sortable: modelField.isSortable,
            searchable: modelField.isSearchable,
            field: modelField.field.fieldId,
            path: createFieldPath({
                parentPath,
                modelField: modelField,
                searchPlugin
            })
        });
        return plugins;
    }, {});

    return createSort({
        fieldPlugins: sortPlugins,
        sort
    });
};
/**
 * Latest and published are specific in Elasticsearch to that extend that they are tagged in the __type property.
 * We allow either published or either latest.
 * Latest is used in the manage API and published in the read API.
 */
const createInitialQueryValue = (
    args: CreateElasticsearchQueryArgs
): ElasticsearchBoolQueryConfig => {
    const { where } = args;

    const query: ElasticsearchBoolQueryConfig = {
        must: [],
        must_not: [],
        should: [],
        filter: []
    };

    // When ES index is shared between tenants, we need to filter records by tenant ID
    const sharedIndex = process.env.ELASTICSEARCH_SHARED_INDEXES === "true";
    if (sharedIndex) {
        query.must.push({ term: { "tenant.keyword": where.tenant } });
    }
    delete where["tenant"];

    if (where.locale) {
        query.must.push({
            term: {
                "locale.keyword": where.locale
            }
        });
    }
    delete where["locale"];
    /**
     * We must transform published and latest where args into something that is understandable by our Elasticsearch
     */
    if (where.published === true) {
        query.must.push({
            term: {
                "__type.keyword": createPublishedType()
            }
        });
    } else if (where.latest === true) {
        query.must.push({
            term: {
                "__type.keyword": createLatestType()
            }
        });
    }
    // we do not allow not published and not latest
    else if (where.published === false) {
        throw new WebinyError(
            `Cannot call Elasticsearch query with "published" set at false.`,
            "ELASTICSEARCH_UNSUPPORTED_QUERY",
            {
                where
            }
        );
    } else if (where.latest === false) {
        throw new WebinyError(
            `Cannot call Elasticsearch query with "latest" set at false.`,
            "ELASTICSEARCH_UNSUPPORTED_QUERY",
            {
                where
            }
        );
    }
    //
    return query;
};

interface CreateFieldPathParams {
    modelField: ModelField;
    searchPlugin?: ElasticsearchQueryBuilderValueSearchPlugin;
    parentPath?: string;
}
const createFieldPath = ({
    modelField,
    searchPlugin,
    parentPath
}: CreateFieldPathParams): string => {
    let path;
    if (searchPlugin && typeof searchPlugin.createPath === "function") {
        path = searchPlugin.createPath({
            field: modelField.field
        });
    } else if (typeof modelField.path === "function") {
        path = modelField.path(modelField.field.fieldId);
    }
    if (!path) {
        path = modelField.path || modelField.field.fieldId || modelField.field.id;
    }
    return modelField.isSystemField || !parentPath || path.match(parentPath)
        ? path
        : `${parentPath}.${path}`;
};

const hasKeyword = (modelField: ModelField): boolean => {
    /**
     * We defined some field types that MUST have no keyword added to the field path
     */
    if (noKeywordFields.includes(modelField.type)) {
        return false;
    } else if (modelField.unmappedType) {
        /**
         * If modelField has unmapped type defined, do not add keyword.
         */
        return false;
    } else if (modelField.keyword === false) {
        /**
         * And if specifically defined that modelField has no keyword, do not add it.
         */
        return false;
    }
    /**
     * All other fields have keyword added.
     */
    return true;
};
/*
 * Iterate through where keys and apply plugins where necessary
 */
const execElasticsearchBuildQueryPlugins = (
    params: CreateElasticsearchQueryArgs
): ElasticsearchBoolQueryConfig => {
    const { where: initialWhere, modelFields, parentPath, plugins, searchPlugins } = params;

    const where: CmsEntryListWhere = {
        ...initialWhere
    };
    const query = createInitialQueryValue({
        ...params,
        where
    });

    /**
     * Always remove special fields, as these do not exist in Elasticsearch.
     */
    for (const sf of specialFields) {
        delete where[sf];
    }

    if (Object.keys(where).length === 0) {
        return query;
    }

    const operatorPlugins = operatorPluginsList(plugins);

    for (const key in where) {
        if (where.hasOwnProperty(key) === false) {
            continue;
        }
        /**
         * We do not need to go further if value is undefined.
         * There are few hardcoded possibilities when value is undefined, for example, ownedBy.
         */
        if (where[key] === undefined) {
            continue;
        }
        const { field, operator } = parseWhereKey(key);
        const modelField = modelFields[field];

        if (!modelField) {
            throw new WebinyError(`There is no field "${field}".`);
        }
        const { isSearchable = false, field: cmsField } = modelField;
        if (!isSearchable) {
            throw new WebinyError(`Field "${field}" is not searchable.`);
        }
        const plugin = operatorPlugins[operator];
        if (!plugin) {
            throw new WebinyError("Operator plugin missing.", "PLUGIN_MISSING", {
                operator
            });
        }
        const fieldSearchPlugin = searchPlugins[modelField.type];
        const value = transformValueForSearch({
            plugins: searchPlugins,
            field: cmsField,
            value: where[key]
        });

        const fieldPath = createFieldPath({
            searchPlugin: fieldSearchPlugin,
            modelField,
            parentPath: parentPath
        });
        const keyword = hasKeyword(modelField);
        plugin.apply(query, {
            basePath: fieldPath,
            path: keyword ? `${fieldPath}.keyword` : fieldPath,
            value,
            keyword
        });
    }

    return query;
};

export const createElasticsearchQueryBody = (params: CreateElasticsearchParams): esSearchBody => {
    const { plugins, model, args, parentPath = null } = params;
    const { where, after, limit, sort: initialSort } = args;

    const modelFields = createModelFields(plugins, model);
    const searchPlugins = searchPluginsList(plugins);

    const query = execElasticsearchBuildQueryPlugins({
        model,
        plugins,
        where,
        modelFields,
        parentPath,
        searchPlugins
    });

    const queryPlugins = plugins
        .byType<CmsEntryElasticsearchQueryModifierPlugin>(
            CmsEntryElasticsearchQueryModifierPlugin.type
        )
        .filter(pl => {
            return !pl.modelId || pl.modelId === model.modelId;
        });
    for (const pl of queryPlugins) {
        pl.modifyQuery({ query, model, where });
    }

    const sort = createElasticsearchSortParams({
        plugins,
        sort: initialSort,
        modelFields,
        parentPath,
        model,
        searchPlugins
    });

    const sortPlugins = plugins
        .byType<CmsEntryElasticsearchSortModifierPlugin>(
            CmsEntryElasticsearchSortModifierPlugin.type
        )
        .filter(pl => {
            return !pl.modelId || pl.modelId === model.modelId;
        });
    for (const pl of sortPlugins) {
        pl.modifySort({
            sort,
            model
        });
    }

    const body: esSearchBody = {
        query: {
            bool: {
                must: query.must.length > 0 ? query.must : undefined,
                must_not: query.must_not.length > 0 ? query.must_not : undefined,
                should: query.should.length > 0 ? query.should : undefined,
                filter: query.filter.length > 0 ? query.filter : undefined
            }
        },
        sort,
        size: limit + 1,
        // eslint-disable-next-line
        search_after: decodeCursor(after) as any,
        // eslint-disable-next-line
        track_total_hits: true
    };

    const bodyPlugins = plugins
        .byType<CmsEntryElasticsearchBodyModifierPlugin>(
            CmsEntryElasticsearchBodyModifierPlugin.type
        )
        .filter(pl => {
            return !pl.modelId || pl.modelId === model.modelId;
        });
    for (const pl of bodyPlugins) {
        pl.modifyBody({
            body,
            model
        });
    }

    return body;
};
