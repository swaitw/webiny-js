import type ApolloClient from "apollo-client";
import gql from "graphql-tag";
import { WebinyError } from "@webiny/error";
import { GenericRecord } from "@webiny/app/types";
import { PageTemplateDto } from "~/features/pageTemplate/updatePageTemplate/PageTemplateDto";
import { IUpdatePageTemplateGateway } from "~/features/pageTemplate/updatePageTemplate/IUpdatePageTemplateGateway";

const UPDATE_PAGE_TEMPLATE = gql`
    mutation UpdatePageTemplate($id: ID!, $data: PbUpdatePageTemplateInput!) {
        pageBuilder {
            updatePageTemplate(id: $id, data: $data) {
                data {
                    id
                    title
                    slug
                    tags
                    description
                    layout
                    content
                    createdOn
                    savedOn
                    dataSources {
                        name
                        type
                        config
                    }
                    dataBindings {
                        dataSource
                        bindFrom
                        bindTo
                    }
                    createdBy {
                        id
                        displayName
                        type
                    }
                }
                error {
                    code
                    message
                    data
                }
            }
        }
    }
`;

interface MutationType {
    pageBuilder: {
        updatePageTemplate:
            | {
                  data: PageTemplateDto;
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

export class UpdatePageTemplateGqlGateway implements IUpdatePageTemplateGateway {
    private client: ApolloClient<any>;

    constructor(client: ApolloClient<any>) {
        this.client = client;
    }

    async execute(pageTemplateDto: PageTemplateDto): Promise<PageTemplateDto> {
        const { id, ...pageTemplateData } = pageTemplateDto;

        const mutation = await this.client.mutate<MutationType>({
            mutation: UPDATE_PAGE_TEMPLATE,
            variables: {
                id,
                data: pageTemplateData
            }
        });

        if (mutation.errors) {
            throw new WebinyError(mutation.errors[0].message);
        }

        if (!mutation.data) {
            throw new WebinyError(`No data was returned from "UpdatePageTemplate" mutation!`);
        }

        const { data, error } = mutation.data.pageBuilder.updatePageTemplate;

        if (!data) {
            throw new WebinyError(error);
        }

        return data;
    }
}
