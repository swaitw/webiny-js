import { createContextPlugin, ICreateLoggerContextParams } from "./context";
import { createLifecycle } from "./lifecycle";
import { createPruneLogsTask } from "~/tasks/createPruneLogsTask";

export const createLogger = (params?: ICreateLoggerContextParams) => {
    return [createLifecycle(), createContextPlugin(params), createPruneLogsTask()];
};
