import { addToOutputs } from "./addToOutputs";

interface RunNodeScriptOptions {
    outputAs?: string;
}

export const runNodeScript = (
    name: string,
    params: string = "",
    options: RunNodeScriptOptions = {}
) => {
    const scriptPath = `.github/workflows/wac/utils/runNodeScripts/${name}.js`;
    let cmd = `node ${scriptPath} '${params}'`;
    if (options.outputAs) {
        cmd = addToOutputs(options.outputAs, `$(${cmd})`);
    }

    return cmd;
};
