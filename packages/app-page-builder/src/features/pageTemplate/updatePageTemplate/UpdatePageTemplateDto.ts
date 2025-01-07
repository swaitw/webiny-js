import { PbDataBinding, PbDataSource } from "~/types";

export interface UpdatePageTemplateDto {
    id: string;
    title: string;
    slug: string;
    description: string;
    tags: string[];
    layout: string;
    content: any;
    dataSources: PbDataSource[];
    dataBindings: PbDataBinding[];
}
