import { CmsModel } from "@webiny/api-headless-cms/types";
import { PathsParser } from "./converter/PathsParser";
import { SelectionFormatter } from "./converter/SelectionFormatter";

export class ModelGetQuery {
    getQuery(model: CmsModel, paths: string[]) {
        const parser = new PathsParser();
        const formatter = new SelectionFormatter();

        const selection = formatter.formatSelection(parser.parse(paths));

        return /* GraphQL */ `
            query GetEntry($entryId: String!) {
                entry: get${model.singularApiName}(where: { entryId: $entryId }) {
                    data ${selection}                   
                    error {
                        code
                        message
                        data
                    }
                }
            }
        `;
    }
}
