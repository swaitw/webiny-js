export interface IDeletePageTemplateGateway {
    execute(pageTemplateId: string): Promise<void>;
}
