import { Project, ProjectApplication } from "../types";

export interface IGetProjectParams {
    cwd: string;
}

export declare function getProject(params?: IGetProjectParams): Project;

export interface IGetProjectApplicationParams {
    cwd: string;
}

export declare function getProjectApplication(
    params: IGetProjectApplicationParams
): ProjectApplication;

export declare function sendEvent(event: string, properties?: Record<string, any>): Promise<void>;

export declare function sleepSync(ms?: number): void;

export declare const log: {
    log: ((...args: any[]) => void) & { hl: (message: string) => string };
    info: ((...args: any[]) => void) & { hl: (message: string) => string };
    success: ((...args: any[]) => void) & { hl: (message: string) => string };
    debug: ((...args: any[]) => void) & { hl: (message: string) => string };
    warning: ((...args: any[]) => void) & { hl: (message: string) => string };
    error: ((...args: any[]) => void) & { hl: (message: string) => string };
};
