export interface ExtensionCommandDownloadFromParams {
    downloadFrom: string;
}

export interface ExtensionCommandGenerateParams {
    type: string;
    name: string;
    packageName?: string;
    location?: string;
    dependencies?: string;
}

export type ExtensionCommandNoParams = object;

export type ExtensionsCommandParams =
    | ExtensionCommandDownloadFromParams
    | ExtensionCommandGenerateParams
    | ExtensionCommandNoParams;

export interface ExtensionMessage {
    text: string;
    variables?: string[];
}

export type ExtensionJson = Partial<{
    nextSteps: {
        clearExisting: boolean;
        messages: ExtensionMessage[];
    };
    additionalNotes: {
        clearExisting?: boolean;
        messages: ExtensionMessage[];
    };
}>;
