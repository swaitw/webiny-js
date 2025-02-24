import dotProp from "dot-prop-immutable";
import {
    GET_FORM_REVISIONS,
    GetFormRevisionsQueryResponse,
    GetFormRevisionsQueryVariables,
    LIST_FORMS,
    ListFormsQueryResponse
} from "../graphql";
import { DataProxy } from "apollo-cache";
import { FbRevisionModel } from "~/types";

// Replace existing "latest" revision with the new revision
export const updateLatestRevisionInListCache = (
    cache: DataProxy,
    revision: FbRevisionModel
): void => {
    const gqlParams = { query: LIST_FORMS };

    const [uniqueId] = revision.id.split("#");

    const response = cache.readQuery<ListFormsQueryResponse>(gqlParams);
    if (!response || !response.formBuilder) {
        return;
    }
    const { formBuilder } = response;

    if (!formBuilder.listForms?.data) {
        return;
    }

    const index = formBuilder.listForms.data.findIndex(item => item.id.startsWith(uniqueId));
    if (index < 0) {
        return;
    }

    cache.writeQuery({
        ...gqlParams,
        data: {
            formBuilder: dotProp.set(formBuilder, `listForms.data.${index}`, revision)
        }
    });
};

export const addFormToListCache = (cache: DataProxy, revision: FbRevisionModel): void => {
    const gqlParams = { query: LIST_FORMS };

    const response = cache.readQuery<ListFormsQueryResponse>(gqlParams);
    if (!response || !response.formBuilder) {
        return;
    }
    const { formBuilder } = response;

    cache.writeQuery({
        ...gqlParams,
        data: {
            formBuilder: dotProp.set(formBuilder, `listForms.data`, [
                revision,
                ...(formBuilder.listForms.data || [])
            ])
        }
    });
};

export const addRevisionToRevisionsCache = (
    cache: DataProxy,
    newRevision: FbRevisionModel
): void => {
    const gqlParams = {
        query: GET_FORM_REVISIONS,
        variables: { id: newRevision.id.split("#")[0] }
    };

    const response = cache.readQuery<GetFormRevisionsQueryResponse, GetFormRevisionsQueryVariables>(
        gqlParams
    );
    if (!response || !response.formBuilder) {
        return;
    }
    const { formBuilder } = response;

    cache.writeQuery({
        ...gqlParams,
        data: {
            formBuilder: dotProp.set(formBuilder, `revisions.data`, [
                newRevision,
                ...(formBuilder.revisions.data || [])
            ])
        }
    });
};

export const removeFormFromListCache = (cache: DataProxy, form: FbRevisionModel): void => {
    // Delete the form from list cache
    const gqlParams = { query: LIST_FORMS };
    const response = cache.readQuery<ListFormsQueryResponse>(gqlParams);
    if (!response || !response.formBuilder) {
        return;
    }
    const { formBuilder } = response;
    if (!formBuilder.listForms?.data) {
        return;
    }

    const index = formBuilder.listForms.data.findIndex(item => item.id === form.id);
    if (index < 0) {
        return;
    }

    cache.writeQuery({
        ...gqlParams,
        data: {
            formBuilder: dotProp.delete(formBuilder, `listForms.data.${index}`)
        }
    });
};

export const removeRevisionFromFormCache = (
    cache: DataProxy,
    form: FbRevisionModel,
    revision: FbRevisionModel
): FbRevisionModel[] => {
    const gqlParams = {
        query: GET_FORM_REVISIONS,
        variables: { id: form.id.split("#")[0] }
    };

    const response = cache.readQuery<GetFormRevisionsQueryResponse, GetFormRevisionsQueryVariables>(
        gqlParams
    );

    if (!response || !response.formBuilder) {
        return [];
    }
    let { formBuilder } = response;
    if (!formBuilder.revisions?.data) {
        return [];
    }

    const index = formBuilder.revisions.data.findIndex(item => item.id === revision.id);
    if (index < 0) {
        return formBuilder.revisions.data;
    }

    formBuilder = dotProp.delete(
        formBuilder,
        `revisions.data.${index}`
    ) as GetFormRevisionsQueryResponse["formBuilder"];

    cache.writeQuery({
        ...gqlParams,
        data: {
            formBuilder
        }
    });

    // Return new revisions
    return formBuilder.revisions.data || [];
};
