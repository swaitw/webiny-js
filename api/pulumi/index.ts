import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import ApiGateway from "./dev/apiGateway";

const role = new aws.iam.Role("api-lambda-role", {
    assumeRolePolicy: {
        Version: "2012-10-17",
        Statement: [
            {
                Action: "sts:AssumeRole",
                Principal: {
                    Service: "lambda.amazonaws.com"
                },
                Effect: "Allow"
            }
        ]
    }
});

new aws.iam.RolePolicyAttachment("api-lambda-role-policy", {
    role: role,
    policyArn: "arn:aws:iam::aws:policy/AdministratorAccess"
});

const lambdaFunction = new aws.lambda.Function("headless-cms2", {
    runtime: "nodejs12.x",
    handler: "handler.handler",
    role: role.arn,
    timeout: 30,
    memorySize: 512,
    code: new pulumi.asset.AssetArchive({
        ".": new pulumi.asset.FileArchive("./../code/headlessCMS/build")
    })
});

const apiGateway = new ApiGateway({
    routes: [
        {
            name: "test",
            path: "/test",
            method: "GET",
            function: lambdaFunction
        }
    ]
});

export const LAMBDA_ARN = lambdaFunction.arn;
export const API_GW = apiGateway.defaultStage.invokeUrl;
