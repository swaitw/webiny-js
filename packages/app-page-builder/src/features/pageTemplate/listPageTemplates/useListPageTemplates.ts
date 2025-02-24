import { useEffect, useMemo, useState } from "react";
import type ApolloClient from "apollo-client";
import { autorun, toJS } from "mobx";
import { useApolloClient } from "@apollo/react-hooks";
import { PbPageTemplateWithContent } from "~/types";
import { pageTemplateCache } from "~/features/pageTemplate/pageTemplateCache";
import { ListPageTemplatesGqlGateway } from "~/features/pageTemplate/listPageTemplates/ListPageTemplatesGqlGateway";
import { ListPageTemplatesRepository } from "~/features/pageTemplate/listPageTemplates/ListPageTemplatesRepository";
import { IListPageTemplatesRepository } from "~/features/pageTemplate/listPageTemplates/IListPageTemplatesRepository";

class RepositoryFactory {
    private cache: Map<ApolloClient<any>, IListPageTemplatesRepository> = new Map();

    get(client: ApolloClient<any>): IListPageTemplatesRepository {
        if (!this.cache.has(client)) {
            const gateway = new ListPageTemplatesGqlGateway(client);
            const repository = new ListPageTemplatesRepository(gateway, pageTemplateCache);
            this.cache.set(client, repository);
        }

        return this.cache.get(client) as IListPageTemplatesRepository;
    }
}

const repositoryFactory = new RepositoryFactory();

export const useListPageTemplates = () => {
    const client = useApolloClient();

    const [vm, setVm] = useState<{ loading: boolean; pageTemplates: PbPageTemplateWithContent[] }>({
        loading: true,
        pageTemplates: []
    });

    const repository = useMemo(() => {
        return repositoryFactory.get(client);
    }, []);

    useEffect(() => {
        repository.execute();
    }, []);

    useEffect(() => {
        autorun(() => {
            const loading = repository.getLoading();
            const templates = repository.getPageTemplates();
            setVm({ loading, pageTemplates: templates.map(template => toJS(template)) });
        });
    }, [repository]);

    return vm;
};
