import { PbPageTemplateWithContent } from "~/types";

export interface IListPageTemplatesRepository {
    getLoading(): boolean;
    getPageTemplates(): PbPageTemplateWithContent[];
    execute(): Promise<PbPageTemplateWithContent[]>;
}
