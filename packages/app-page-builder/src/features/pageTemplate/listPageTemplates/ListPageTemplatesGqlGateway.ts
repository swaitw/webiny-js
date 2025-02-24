import ApolloClient from "apollo-client";
import gql from "graphql-tag";
import { IListPageTemplatesGateway } from "./IListPageTemplatesGateway";
import { PbPageTemplateWithContent } from "~/types";
import { GenericRecord } from "@webiny/app/types";
import { WebinyError } from "@webiny/error";

const LIST_PAGE_TEMPLATES = gql`
    query ListPageTemplates {
        pageBuilder {
            listPageTemplates {
                data {
                    id
                    title
                    slug
                    tags
                    description
                    layout
                    content
                    dataBindings {
                        dataSource
                        bindFrom
                        bindTo
                    }
                    dataSources {
                        name
                        type
                        config
                    }
                    createdOn
                    savedOn
                    createdBy {
                        id
                        displayName
                        type
                    }
                }
                error {
                    code
                    data
                    message
                }
            }
        }
    }
`;

interface QueryType {
    pageBuilder: {
        listPageTemplates:
            | {
                  data: PbPageTemplateWithContent[];
                  error: undefined;
              }
            | {
                  data: undefined;
                  error: {
                      code: string;
                      message: string;
                      data: GenericRecord<string>;
                  };
              };
    };
}

export class ListPageTemplatesGqlGateway implements IListPageTemplatesGateway {
    private client: ApolloClient<any>;

    constructor(client: ApolloClient<any>) {
        this.client = client;
    }

    async execute(): Promise<PbPageTemplateWithContent[]> {
        const query = await this.client.query<QueryType>({
            query: LIST_PAGE_TEMPLATES,
            fetchPolicy: "no-cache"
        });

        if (query.errors) {
            throw new WebinyError(query.errors[0].message);
        }

        if (!query.data) {
            throw new WebinyError(`No data was returned from "listPageTemplates" query!`);
        }

        const { data, error } = query.data.pageBuilder.listPageTemplates;

        if (!data) {
            throw new WebinyError(error);
        }

        return data.map(template => {
            return {
                ...template,
                dataSources: template.dataSources || [],
                dataBindings: template.dataBindings || []
            };
        });
    }
}
