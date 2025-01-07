import type ApolloClient from "apollo-client";
import gql from "graphql-tag";
import { WebinyError } from "@webiny/error";
import { GenericRecord } from "@webiny/app/types";
import { PageTemplateInputDto } from "~/features/pageTemplate/createPageTemplate/PageTemplateInputDto";
import { PbPageTemplateWithContent } from "~/types";
import { ICreatePageTemplateFromPageGateway } from "~/features/pageTemplate/createPageTemplateFromPage/ICreatePageTemplateFromPageGateway";

const CREATE_TEMPLATE_FROM_PAGE = gql`
    mutation CreateTemplateFromPage($pageId: ID!, $data: PbCreateTemplateFromPageInput) {
        pageBuilder {
            createTemplateFromPage(pageId: $pageId, data: $data) {
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
        createTemplateFromPage:
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

export class CreatePageTemplateFromPageGqlGateway implements ICreatePageTemplateFromPageGateway {
    private client: ApolloClient<any>;

    constructor(client: ApolloClient<any>) {
        this.client = client;
    }

    async execute(
        pageId: string,
        pageTemplateInputDto: PageTemplateInputDto
    ): Promise<PbPageTemplateWithContent> {
        const mutation = await this.client.mutate<MutationType>({
            mutation: CREATE_TEMPLATE_FROM_PAGE,
            variables: {
                pageId,
                data: pageTemplateInputDto
            }
        });

        if (mutation.errors) {
            throw new WebinyError(mutation.errors[0].message);
        }

        if (!mutation.data) {
            throw new WebinyError(`No data was returned from "CreateTemplateFromPage" mutation!`);
        }

        const { data, error } = mutation.data.pageBuilder.createTemplateFromPage;

        if (!data) {
            throw new WebinyError(error);
        }

        return data;
    }
}
