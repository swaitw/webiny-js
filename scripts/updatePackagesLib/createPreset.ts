export interface IPreset {
    name: string;
    matching: RegExp;
    skipResolutions: boolean;
    caret?: boolean;
}
export interface ICreatePresetCb {
    (): IPreset;
}

export const createPreset = (cb: ICreatePresetCb) => {
    return cb();
};
