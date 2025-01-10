import type ApolloClient from "apollo-client";
import gql from "graphql-tag";
import { WebinyError } from "@webiny/error";
import { GenericRecord } from "@webiny/app/types";
import { ICreatePageTemplateGateway } from "~/features/pageTemplate/createPageTemplate/ICreatePageTemplateGateway";
import { PageTemplateInputDto } from "~/features/pageTemplate/createPageTemplate/PageTemplateInputDto";
import { PbPageTemplateWithContent } from "~/types";

const CREATE_PAGE_TEMPLATE = gql`
    mutation CreatePageTemplate($data: PbCreatePageTemplateInput!) {
        pageBuilder {
            createPageTemplate(data: $data) {
                data {
                    id
                    title
                    slug
                    tags
                    description
                    layout
                    content
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
                    message
                    data
                }
            }
        }
    }
`;

interface MutationType {
    pageBuilder: {
        createPageTemplate:
            | {
                  data: PbPageTemplateWithContent;
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

export class CreatePageTemplateGqlGateway implements ICreatePageTemplateGateway {
    private client: ApolloClient<any>;

    constructor(client: ApolloClient<any>) {
        this.client = client;
    }

    async execute(pageTemplateInputDto: PageTemplateInputDto): Promise<PbPageTemplateWithContent> {
        const mutation = await this.client.mutate<MutationType>({
            mutation: CREATE_PAGE_TEMPLATE,
            variables: {
                data: pageTemplateInputDto
            }
        });

        if (mutation.errors) {
            throw new WebinyError(mutation.errors[0].message);
        }

        if (!mutation.data) {
            throw new WebinyError(`No data was returned from "CreatePageTemplate" mutation!`);
        }

        const { data, error } = mutation.data.pageBuilder.createPageTemplate;

        if (!data) {
            throw new WebinyError(error);
        }

        return data;
    }
}
