import {Project, ProjectApplication} from "../types";

export interface IGetProjectParams {
    cwd: string;
}

export declare function getProject(params?: IGetProjectParams): Project;

export interface IGetProjectApplicationParams {
    cwd: string;
}

export declare function getProjectApplication(params: IGetProjectApplicationParams): ProjectApplication;
