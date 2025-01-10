import type ApolloClient from "apollo-client";
import gql from "graphql-tag";
import { WebinyError } from "@webiny/error";
import { GenericRecord } from "@webiny/app/types";
import { IDeletePageTemplateGateway } from "~/features/pageTemplate/deletePageTemplate/IDeletePageTemplateGateway";

const DELETE_PAGE_TEMPLATE = gql`
    mutation DeletePageTemplate($id: ID!) {
        pageBuilder {
            deletePageTemplate(id: $id) {
                error {
                    code
                    message
                }
            }
        }
    }
`;

interface MutationType {
    pageBuilder: {
        deletePageTemplate:
            | {
                  data: boolean;
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

export class DeletePageTemplateGqlGateway implements IDeletePageTemplateGateway {
    private client: ApolloClient<any>;

    constructor(client: ApolloClient<any>) {
        this.client = client;
    }

    async execute(pageTemplateId: string): Promise<void> {
        const mutation = await this.client.mutate<MutationType>({
            mutation: DELETE_PAGE_TEMPLATE,
            variables: {
                id: pageTemplateId
            }
        });

        if (mutation.errors) {
            throw new WebinyError(mutation.errors[0].message);
        }

        if (!mutation.data) {
            throw new WebinyError(`No data was returned from "CreatePageTemplate" mutation!`);
        }

        const { error } = mutation.data.pageBuilder.deletePageTemplate;

        if (error) {
            throw new WebinyError(error);
        }
    }
}
