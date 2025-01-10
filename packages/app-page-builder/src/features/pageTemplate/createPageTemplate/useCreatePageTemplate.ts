import { useCallback, useMemo } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { CreatePageTemplateRepository } from "~/features/pageTemplate/createPageTemplate/CreatePageTemplateRepository";
import { pageTemplateCache } from "~/features/pageTemplate/pageTemplateCache";
import { PageTemplateInputDto } from "~/features/pageTemplate/createPageTemplate/PageTemplateInputDto";
import { CreatePageTemplateGqlGateway } from "~/features/pageTemplate/createPageTemplate/CreatePageTemplateGqlGateway";

export const useCreatePageTemplate = () => {
    const client = useApolloClient();

    const repository = useMemo(() => {
        const gateway = new CreatePageTemplateGqlGateway(client);

        return new CreatePageTemplateRepository(gateway, pageTemplateCache);
    }, [client]);

    const createPageTemplate = useCallback(
        (pageTemplate: PageTemplateInputDto) => {
            return repository.execute(pageTemplate);
        },
        [repository]
    );

    return { createPageTemplate };
};
