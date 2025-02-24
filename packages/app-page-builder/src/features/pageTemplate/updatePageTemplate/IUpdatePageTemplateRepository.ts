import { PageTemplateDto } from "./PageTemplateDto";

export interface IUpdatePageTemplateRepository {
    execute(pageTemplate: PageTemplateDto): Promise<void>;
}
