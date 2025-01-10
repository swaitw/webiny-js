import { useCallback, useMemo } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { pageTemplateCache } from "~/features/pageTemplate/pageTemplateCache";
import { UpdatePageTemplateRepository } from "~/features/pageTemplate/updatePageTemplate/UpdatePageTemplateRepository";
import { UpdatePageTemplateGqlGateway } from "~/features/pageTemplate/updatePageTemplate/UpdatePageTemplateGqlGateway";
import { UpdatePageTemplateDto } from "~/features/pageTemplate/updatePageTemplate/UpdatePageTemplateDto";

export const useUpdatePageTemplate = () => {
    const client = useApolloClient();

    const repository = useMemo(() => {
        const gateway = new UpdatePageTemplateGqlGateway(client);

        return new UpdatePageTemplateRepository(gateway, pageTemplateCache);
    }, [client]);

    const updatePageTemplate = useCallback(
        (pageTemplate: UpdatePageTemplateDto) => {
            return repository.execute(pageTemplate);
        },
        [repository]
    );

    return { updatePageTemplate };
};
