import { Context as TaskContext, ITaskResponseDoneResultOutput } from "@webiny/tasks";
import { Context as LoggerContext, LogType } from "~/types";

export interface IPruneLogsInput {
    tenant?: string;
    source?: string;
    type?: LogType;
    createdAfter?: string;
    keys?: string;
    items?: number;
}

export interface IPruneLogsOutput extends ITaskResponseDoneResultOutput {
    items: number;
}

export interface Context extends LoggerContext, TaskContext {}
