import { DescribeEndpointCommand, IoTClient } from "@webiny/aws-sdk/client-iot";
import { getStackOutput } from "~/utils";

export interface IGetIotEndpointParams {
    env: string;
    variant: string | undefined;
}

export const getIotEndpoint = (params: IGetIotEndpointParams): Promise<string> => {
    const iotClient = new IoTClient();

    return iotClient
        .send(
            new DescribeEndpointCommand({
                endpointType: "iot:Data-ATS"
            })
        )
        .then(({ endpointAddress }) => {
            const coreStackOutput = getStackOutput({
                folder: "core",
                env: params.env,
                variant: params.variant
            });

            const watchCommandTopic = `webiny-watch-${coreStackOutput.deploymentId}`;
            const iotAuthorizerName = coreStackOutput.iotAuthorizerName;

            const queryParams = [
                `x-amz-customauthorizer-name=${iotAuthorizerName}`,
                `x-webiny-watch-command-topic=${watchCommandTopic}`
            ].join("&");

            return `wss://${endpointAddress}/mqtt?${queryParams}`;
        });
};
