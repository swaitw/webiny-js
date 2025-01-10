import { PbDataBinding, PbDataSource } from "~/types";

export interface PageTemplateDto {
    id: string;
    title: string;
    slug: string;
    description: string;
    tags: string[];
    layout: string;
    dataSources: PbDataSource[];
    dataBindings: PbDataBinding[];
}
