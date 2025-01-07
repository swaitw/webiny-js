import { useCallback, useMemo } from "react";
import type ApolloClient from "apollo-client";
import { useApolloClient } from "@apollo/react-hooks";
import { pageTemplateCache } from "~/features/pageTemplate/pageTemplateCache";
import { ListPageTemplatesGqlGateway } from "~/features/pageTemplate/listPageTemplates/ListPageTemplatesGqlGateway";
import { RefreshPageTemplatesRepository } from "~/features/pageTemplate/refreshPageTemplates/RefreshPageTemplatesRepository";
import { IRefreshPageTemplatesRepository } from "~/features/pageTemplate/refreshPageTemplates/IRefreshPageTemplatesRepository";

class RepositoryFactory {
    private cache: Map<ApolloClient<any>, IRefreshPageTemplatesRepository> = new Map();

    get(client: ApolloClient<any>): IRefreshPageTemplatesRepository {
        if (!this.cache.has(client)) {
            const gateway = new ListPageTemplatesGqlGateway(client);
            const repository = new RefreshPageTemplatesRepository(gateway, pageTemplateCache);
            this.cache.set(client, repository);
        }

        return this.cache.get(client) as IRefreshPageTemplatesRepository;
    }
}

const repositoryFactory = new RepositoryFactory();

export const useRefreshPageTemplates = () => {
    const client = useApolloClient();

    const repository = useMemo(() => {
        return repositoryFactory.get(client);
    }, []);

    const refreshPageTemplates = useCallback(() => {
        repository.execute();
    }, []);

    return { refreshPageTemplates };
};
