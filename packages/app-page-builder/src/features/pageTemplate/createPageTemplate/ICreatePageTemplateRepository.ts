import { PageTemplateInputDto } from "./PageTemplateInputDto";
import { PbPageTemplateWithContent } from "~/types";

export interface ICreatePageTemplateRepository {
    execute(pageTemplate: PageTemplateInputDto): Promise<PbPageTemplateWithContent>;
}
