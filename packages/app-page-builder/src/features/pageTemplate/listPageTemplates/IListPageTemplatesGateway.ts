import { PbPageTemplateWithContent } from "~/types";

export interface IListPageTemplatesGateway {
    execute(): Promise<PbPageTemplateWithContent[]>;
}
