import { useCallback, useMemo } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { CreatePageTemplateFromPageRepository } from "~/features/pageTemplate/createPageTemplateFromPage/CreatePageTemplateFromPageRepository";
import { pageTemplateCache } from "~/features/pageTemplate/pageTemplateCache";
import { PageTemplateInputDto } from "./PageTemplateInputDto";
import { CreatePageTemplateFromPageGqlGateway } from "~/features/pageTemplate/createPageTemplateFromPage/CreatePageTemplateFromPageGqlGateway";

export const useCreatePageTemplateFromPage = () => {
    const client = useApolloClient();

    const repository = useMemo(() => {
        const gateway = new CreatePageTemplateFromPageGqlGateway(client);

        return new CreatePageTemplateFromPageRepository(gateway, pageTemplateCache);
    }, [client]);

    const createPageTemplateFromPage = useCallback(
        (pageId: string, pageTemplate: PageTemplateInputDto) => {
            return repository.execute(pageId, pageTemplate);
        },
        [repository]
    );

    return { createPageTemplateFromPage };
};
