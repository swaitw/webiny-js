import { createConfiguration } from "./configuration";
import { Project } from "~/types";

export interface IWithProjectNameParams {
    project: Project;
}

export const withProjectName = ({ project }: IWithProjectNameParams) => {
    return createConfiguration(() => {
        return {
            WEBINY_PROJECT_NAME: project.name
        };
    });
};
