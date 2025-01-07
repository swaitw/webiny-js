import { ICreatePageTemplateFromPageRepository } from "./ICreatePageTemplateFromPageRepository";
import { PageTemplateInputDto } from "~/features/pageTemplate/createPageTemplateFromPage/PageTemplateInputDto";
import { PbPageTemplateWithContent } from "~/types";
import { ListCache } from "~/features/ListCache";
import { ICreatePageTemplateFromPageGateway } from "~/features/pageTemplate/createPageTemplateFromPage/ICreatePageTemplateFromPageGateway";

export class CreatePageTemplateFromPageRepository implements ICreatePageTemplateFromPageRepository {
    private cache: ListCache<PbPageTemplateWithContent>;
    private gateway: ICreatePageTemplateFromPageGateway;

    constructor(
        gateway: ICreatePageTemplateFromPageGateway,
        pageTemplateCache: ListCache<PbPageTemplateWithContent>
    ) {
        this.gateway = gateway;
        this.cache = pageTemplateCache;
    }

    async execute(
        pageId: string,
        pageTemplateInput: PageTemplateInputDto
    ): Promise<PbPageTemplateWithContent> {
        const pageTemplate = await this.gateway.execute(pageId, pageTemplateInput);

        this.cache.addItems([pageTemplate]);

        return pageTemplate;
    }
}
