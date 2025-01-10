import { PageTemplateInputDto } from "./PageTemplateInputDto";
import { PbPageTemplateWithContent } from "~/types";

export interface ICreatePageTemplateGateway {
    execute(pageTemplateDto: PageTemplateInputDto): Promise<PbPageTemplateWithContent>;
}
