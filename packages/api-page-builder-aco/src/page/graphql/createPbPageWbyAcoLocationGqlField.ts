import { PbAcoContext } from "~/types";
import { Page } from "@webiny/api-page-builder/types";
import { GraphQLSchemaPlugin } from "@webiny/handler-graphql";
import { ROOT_FOLDER } from "~/contants";

export const createPbPageWbyAcoLocationGqlField = (ctx: PbAcoContext) => {
    ctx.plugins.register(
        new GraphQLSchemaPlugin<PbAcoContext>({
            typeDefs: /* GraphQL */ `
                type WbyPbAcoLocation {
                    folderId: String
                }

                extend type PbPage {
                    wbyAco_location: WbyPbAcoLocation
                }
            `,
            resolvers: {
                PbPage: {
                    wbyAco_location: async (page: Page, _: unknown, context) => {
                        const pageSearchRecord = await context.pageBuilderAco.app.search.get(
                            page.pid
                        );

                        if (!pageSearchRecord) {
                            return {
                                folderId: null
                            };
                        }

                        return {
                            folderId: pageSearchRecord.location.folderId || ROOT_FOLDER
                        };
                    }
                }
            }
        })
    );
};
