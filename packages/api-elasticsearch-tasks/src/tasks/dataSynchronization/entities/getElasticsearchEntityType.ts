export enum EntityType {
    CMS = "headless-cms",
    PAGE_BUILDER = "page-builder",
    FORM_BUILDER = "form-builder",
    FORM_BUILDER_SUBMISSION = "form-builder-submission"
}

export interface IGetElasticsearchEntityTypeParams {
    SK: string;
    index: string;
}

export const getElasticsearchEntityType = (
    params: IGetElasticsearchEntityTypeParams
): EntityType => {
    if (params.index.includes("-headless-cms-")) {
        return EntityType.CMS;
    } else if (params.index.endsWith("-page-builder")) {
        return EntityType.PAGE_BUILDER;
    } else if (params.index.endsWith("-form-builder")) {
        if (params.SK.startsWith("FS#")) {
            return EntityType.FORM_BUILDER_SUBMISSION;
        }
        return EntityType.FORM_BUILDER;
    }
    throw new Error(`Unknown entity type for item "${JSON.stringify(params)}".`);
};
