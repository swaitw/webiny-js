import { APIGatewayEvent } from "@webiny/aws-sdk/types";
export const createLambdaEvent = (options: Partial<APIGatewayEvent> = {}): APIGatewayEvent => {
    return {
        httpMethod: "POST",
        path: "/webiny",
        body: null,
        ...options
    } as APIGatewayEvent;
};
