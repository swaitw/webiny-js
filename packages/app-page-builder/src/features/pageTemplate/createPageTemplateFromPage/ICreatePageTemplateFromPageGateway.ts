import { PageTemplateInputDto } from "./PageTemplateInputDto";
import { PbPageTemplateWithContent } from "~/types";

export interface ICreatePageTemplateFromPageGateway {
    execute(
        pageId: string,
        pageTemplateDto: PageTemplateInputDto
    ): Promise<PbPageTemplateWithContent>;
}
