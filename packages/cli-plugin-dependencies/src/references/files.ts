import path from "path";

export interface IFilePathParams {
    dirname: string;
    target?: string;
}

export const getReferencesFilePath = (params: IFilePathParams): string => {
    const { dirname, target } = params;
    return path.join(dirname, target || "", "references.json");
};

export const getDuplicatesFilePath = (params: IFilePathParams): string => {
    const { dirname, target } = params;
    return path.join(dirname, target || "", "duplicates.json");
};
