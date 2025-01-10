import { PageTemplateInputDto } from "./PageTemplateInputDto";
import { PbPageTemplateWithContent } from "~/types";

export interface ICreatePageTemplateFromPageRepository {
    execute(pageId: string, pageTemplate: PageTemplateInputDto): Promise<PbPageTemplateWithContent>;
}
