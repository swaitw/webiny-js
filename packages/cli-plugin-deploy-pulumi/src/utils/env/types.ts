export interface IConfiguration {
    [key: string]: string | undefined;
}

export interface IConfigurationCbParams {
    readonly previous: IConfiguration;
}

export interface IConfigurationCb {
    (params: IConfigurationCbParams): IConfiguration | undefined | null;
}
