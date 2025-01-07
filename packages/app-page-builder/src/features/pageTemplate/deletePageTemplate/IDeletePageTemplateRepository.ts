export interface IDeletePageTemplateRepository {
    execute(pageTemplateId: string): Promise<void>;
}
