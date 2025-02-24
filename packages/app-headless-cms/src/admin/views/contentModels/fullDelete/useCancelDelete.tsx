import { CmsModel } from "~/types";
import { useApolloClient } from "~/admin/hooks";
import type {
    ICancelDeleteCmsModelMutationResponse,
    ICancelDeleteCmsModelMutationVariables
} from "~/admin/viewsGraphql";
import { CANCEL_DELETE_CONTENT_MODEL } from "~/admin/viewsGraphql";
import { updateModelInCache } from "../cache";
import { useSnackbar } from "@webiny/app-admin";
import { i18n } from "@webiny/app/i18n";

const t = i18n.ns("app-headless-cms/admin/views/content-models/fully-delete-model");

export interface IUseCancelDeleteProps {
    model: CmsModel;
}

export const useCancelDelete = ({ model }: IUseCancelDeleteProps) => {
    const client = useApolloClient();
    const { showSnackbar } = useSnackbar();

    return {
        cancel: async () => {
            await client.mutate<
                ICancelDeleteCmsModelMutationResponse,
                ICancelDeleteCmsModelMutationVariables
            >({
                mutation: CANCEL_DELETE_CONTENT_MODEL,
                variables: {
                    modelId: model.modelId
                },
                update(cache, { data }) {
                    if (!data?.cancelFullyDeleteModel) {
                        showSnackbar("Missing data on Delete Content Model Mutation Response.");
                        return;
                    }
                    const error = data.cancelFullyDeleteModel.error;

                    if (error) {
                        showSnackbar(error.message, {
                            title: t`Something unexpected happened.`
                        });
                        /**
                         * In case model is not being deleted or task is not defined in the data, just set the model to not being deleted.
                         */
                        if (
                            error.code === "MODEL_NOT_BEING_DELETED" ||
                            error.code === "DELETE_MODEL_NO_TASK_DEFINED"
                        ) {
                            updateModelInCache(cache, {
                                ...model,
                                isBeingDeleted: false
                            });
                        }
                        return;
                    }

                    updateModelInCache(cache, {
                        ...model,
                        isBeingDeleted: false
                    });

                    showSnackbar(t`Successfully canceled {name} deletion!.`({ name: model.name }));
                }
            });
        }
    };
};
