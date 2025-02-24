import {
    LIST_BLOCK_CATEGORIES,
    ListPageBlocksQueryResponse
} from "~/admin/views/PageBlocks/graphql";
import { PbBlockCategory } from "~/types";
import createBlockCategoryPlugin from "~/admin/utils/createBlockCategoryPlugin";
import { useQuery } from "@apollo/react-hooks";
import get from "lodash/get";

export const useBlockCategories = () => {
    const blockCategories = useQuery<ListPageBlocksQueryResponse>(LIST_BLOCK_CATEGORIES, {
        onCompleted(data) {
            const blockCategoriesData: PbBlockCategory[] =
                get(data, "pageBuilder.listBlockCategories.data") || [];
            blockCategoriesData.forEach(element => {
                createBlockCategoryPlugin({
                    ...element
                });
            });
        }
    });

    return blockCategories.loading;
};
