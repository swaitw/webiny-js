import { useQuery } from "@apollo/react-hooks";
import get from "lodash/get";
import {
    LIST_PAGE_ELEMENTS,
    ListPageElementsQueryResponse,
    ListPageElementsQueryResponseData
} from "~/admin/graphql/pages";
import createElementPlugin from "~/admin/utils/createElementPlugin";

export const useSavedElements = () => {
    const savedElements = useQuery<ListPageElementsQueryResponse>(LIST_PAGE_ELEMENTS, {
        onCompleted: data => {
            const elements: ListPageElementsQueryResponseData[] =
                get(data, "pageBuilder.listPageElements.data") || [];

            elements.forEach(element => {
                if (element.type === "element") {
                    createElementPlugin({
                        ...element,
                        data: {},
                        elements: []
                    });
                }
            });
        }
    });

    return savedElements.loading;
};
