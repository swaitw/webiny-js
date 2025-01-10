import { Context as LambdaContext } from "@webiny/aws-sdk/types";

export const createLambdaContext = (): LambdaContext => {
    return {
        awsRequestId: "abc",
        callbackWaitsForEmptyEventLoop: false,
        functionName: "handler",
        functionVersion: "1",
        invokedFunctionArn: "xyz",
        memoryLimitInMB: "512",
        logGroupName: "custom",
        logStreamName: "custom",
        getRemainingTimeInMillis: () => {
            return 100;
        },
        done: () => {
            return null;
        },
        fail: () => {
            return null;
        },
        succeed: () => {
            return null;
        }
    };
};
