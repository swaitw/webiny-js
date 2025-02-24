import { useCallback, useMemo } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { pageTemplateCache } from "~/features/pageTemplate/pageTemplateCache";
import { DeletePageTemplateRepository } from "~/features/pageTemplate/deletePageTemplate/DeletePageTemplateRepository";
import { DeletePageTemplateGqlGateway } from "~/features/pageTemplate/deletePageTemplate/DeletePageTemplateGqlGateway";

export const useDeletePageTemplate = () => {
    const client = useApolloClient();

    const repository = useMemo(() => {
        const gateway = new DeletePageTemplateGqlGateway(client);

        return new DeletePageTemplateRepository(gateway, pageTemplateCache);
    }, [client]);

    const deletePageTemplate = useCallback(
        (pageTemplateId: string) => {
            return repository.execute(pageTemplateId);
        },
        [repository]
    );

    return { deletePageTemplate };
};
