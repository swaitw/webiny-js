import { PageTemplateDto } from "~/features/pageTemplate/updatePageTemplate/PageTemplateDto";

export interface IUpdatePageTemplateGateway {
    execute(pageTemplateDto: PageTemplateDto): Promise<PageTemplateDto>;
}
