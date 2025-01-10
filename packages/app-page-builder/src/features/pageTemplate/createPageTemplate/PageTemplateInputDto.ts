import type { GenericRecord } from "@webiny/app/types";
import type { PbDataBinding, PbDataSource } from "~/types";

export interface PageTemplateInputDto {
    title: string;
    slug: string;
    description: string;
    tags: string[];
    layout: string;
    content?: GenericRecord;
    dataSources?: PbDataSource[];
    dataBindings?: PbDataBinding[];
}
