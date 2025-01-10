import * as GQL from "~/admin/viewsGraphql";
import { ListCmsModelsQueryResponse, ListCmsModelsQueryVariables } from "~/admin/viewsGraphql";
import { useQuery } from "~/admin/hooks/index";
import { useMemo } from "react";
import { CmsModel } from "~/types";

/**
 * @deprecated Use `useModels` hook instead.
 */
export const useContentModels = () => {
    const {
        data,
        loading,
        error: apolloError,
        refetch
    } = useQuery<ListCmsModelsQueryResponse, ListCmsModelsQueryVariables>(GQL.LIST_CONTENT_MODELS, {
        variables: {
            includeBeingDeleted: true,
            includePlugins: true
        }
    });

    const models = useMemo<CmsModel[]>(() => {
        return data?.listContentModels?.data || [];
    }, [data]);

    const error = useMemo(() => {
        if (!!apolloError) {
            return apolloError.message;
        }
        return data?.listContentModels?.error?.message || null;
    }, [apolloError]);

    return {
        models,
        loading,
        error,
        refresh: refetch
    };
};

export const useModels = () => {
    return useContentModels();
};
