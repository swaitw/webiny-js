import fs from "fs";
import pRetry from "p-retry";
import {
    GetFunctionConfigurationCommand,
    LambdaClient,
    UpdateFunctionCodeCommand,
    UpdateFunctionConfigurationCommand
} from "@webiny/aws-sdk/client-lambda";

const WATCH_MODE_NOTE_IN_DESCRIPTION = " (watch mode 💡)";
const DEFAULT_INCREASE_TIMEOUT = 120;

export interface IReplaceLambdaFunctionsParamsLambdaFunction {
    name: string;
}

export interface IReplaceLambdaFunctionsParams {
    iotEndpoint: string;
    iotEndpointTopic: string;
    sessionId: number;
    lambdaFunctions: IReplaceLambdaFunctionsParamsLambdaFunction[];
    increaseTimeout?: number;
}

export const replaceLambdaFunctions = async ({
    iotEndpoint,
    iotEndpointTopic,
    sessionId,
    lambdaFunctions,
    increaseTimeout
}: IReplaceLambdaFunctionsParams) => {
    const lambdaClient = new LambdaClient();

    return lambdaFunctions.map(async fn => {
        const getFnConfigCmd = new GetFunctionConfigurationCommand({ FunctionName: fn.name });
        const lambdaFnConfiguration = await lambdaClient.send(getFnConfigCmd);

        const updateFnCodeCmd = new UpdateFunctionCodeCommand({
            FunctionName: fn.name,
            ZipFile: fs.readFileSync(__dirname + "/handler/handler.zip")
        });

        await lambdaClient.send(updateFnCodeCmd);

        let Description = lambdaFnConfiguration.Description || "";
        if (!Description.endsWith(WATCH_MODE_NOTE_IN_DESCRIPTION)) {
            Description += WATCH_MODE_NOTE_IN_DESCRIPTION;
        }

        const Timeout = increaseTimeout || DEFAULT_INCREASE_TIMEOUT;

        const updateFnConfigCmd = new UpdateFunctionConfigurationCommand({
            FunctionName: fn.name,
            Timeout,
            Description,
            Environment: {
                Variables: {
                    ...lambdaFnConfiguration.Environment?.Variables,
                    WEBINY_WATCH: JSON.stringify({
                        enabled: true,
                        sessionId,
                        iotEndpoint,
                        iotEndpointTopic,
                        functionName: fn.name
                    })
                }
            }
        });

        await pRetry(() => lambdaClient.send(updateFnConfigCmd));
    });
};
