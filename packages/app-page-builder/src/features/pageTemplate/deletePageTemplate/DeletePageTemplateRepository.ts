import { IDeletePageTemplateRepository } from "./IDeletePageTemplateRepository";
import { PbPageTemplate } from "~/types";
import { ListCache } from "~/features/ListCache";
import { IDeletePageTemplateGateway } from "~/features/pageTemplate/deletePageTemplate/IDeletePageTemplateGateway";

export class DeletePageTemplateRepository implements IDeletePageTemplateRepository {
    private cache: ListCache<PbPageTemplate>;
    private gateway: IDeletePageTemplateGateway;

    constructor(gateway: IDeletePageTemplateGateway, pageTemplateCache: ListCache<PbPageTemplate>) {
        this.gateway = gateway;
        this.cache = pageTemplateCache;
    }

    async execute(pageTemplateId: string): Promise<void> {
        await this.gateway.execute(pageTemplateId);

        this.cache.removeItems(item => item.id === pageTemplateId);
    }
}
