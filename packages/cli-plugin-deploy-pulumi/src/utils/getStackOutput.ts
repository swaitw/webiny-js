import { getProject } from "@webiny/cli/utils";
import { mapStackOutput } from "./mapStackOutput";
import execa from "execa";

const cache: Record<string, any> = {};

export interface IGetOutputJsonParams {
    folder: string;
    env: string;
    cwd?: string | undefined;
    variant: string | undefined;
}

const getOutputJson = ({ folder, env, cwd, variant }: IGetOutputJsonParams) => {
    const project = getProject();

    const cacheKey = [folder, env, variant].filter(Boolean).join("_");

    if (cache[cacheKey]) {
        return cache[cacheKey];
    }

    try {
        const command: string[] = [
            "webiny",
            "output",
            folder,
            "--env",
            env,
            "--json",
            "--no-debug"
        ];
        if (variant) {
            command.push("--variant", variant);
        }

        const { stdout } = execa.sync("yarn", command, {
            cwd: cwd || project.root
        });

        // Let's get the output after the first line break. Everything before is just yarn stuff.
        const extractedJSON = stdout.substring(stdout.indexOf("{"));
        return (cache[cacheKey] = JSON.parse(extractedJSON));
    } catch (e) {
        return null;
    }
};

export interface IGetStackOutputParams {
    folder: string;
    env: string;
    variant: string | undefined;
    cwd?: string;
    map?: Record<string, any>;
}

export interface IStackOutput {
    deploymentId: string;
    region: string;
    dynamoDbTable: string;
    migrationLambdaArn: string;
    iotAuthorizerName: string;
    apiDomain: string;
    apiUrl: string;
    graphqlLambdaRole: string;
    apwSchedulerEventRule: string | undefined;
    apwSchedulerEventTargetId: string | undefined;
    apwSchedulerExecuteAction: string | undefined;
    apwSchedulerScheduleAction: string | undefined;
    cognitoUserPoolArn: string;
    cognitoAppClientId: string;
    cognitoUserPoolId: string;
    cognitoUserPoolPasswordPolicy: string;
    websocketApiUrl: string;
    fileManagerBucketId: string;
    primaryDynamodbTableArn: string;
    primaryDynamodbTableName: string;
    primaryDynamodbTableHashKey: string;
    primaryDynamodbTableRangeKey: string;
    logDynamodbTableArn: string;
    logDynamodbTableName: string;
    logDynamodbTableHashKey: string;
    logDynamodbTableRangeKey: string;
    eventBusName: string;
    eventBusArn: string;
    vpcPublicSubnetIds: string[] | undefined;
    vpcPrivateSubnetIds: string[] | undefined;
    vpcSecurityGroupIds: string[] | undefined;
    elasticsearchDomainArn: string | undefined;
    elasticsearchDomainEndpoint: string | undefined;
    elasticsearchDynamodbTableArn: string | undefined;
    elasticsearchDynamodbTableName: string | undefined;
    appStorage: string;
    websiteRouterOriginRequestFunction?: string;
    /**
     * There is a possibility for a user to add stuff to the stack output.
     */
    [key: string]: string | string[] | undefined | number | number[] | boolean;
}

export const getStackOutput = <T extends IStackOutput = IStackOutput>(
    folderOrArgs: IGetStackOutputParams | string,
    env?: string,
    map?: Record<string, any>
): T => {
    if (!folderOrArgs) {
        throw new Error("Missing initial argument.");
    }

    // Normalize arguments.
    let args: Partial<IGetStackOutputParams> = {};
    if (typeof folderOrArgs === "string") {
        args = {
            folder: folderOrArgs,
            env: env as string,
            map: map
        };
    } else {
        args = folderOrArgs;
    }

    if (!args.folder) {
        throw new Error(`Please specify a project application folder, for example "admin".`);
    }

    if (!args.env) {
        throw new Error(`Please specify environment, for example "dev".`);
    }

    const output = getOutputJson({
        folder: args.folder,
        env: args.env,
        variant: args.variant,
        cwd: args.cwd
    });
    if (!output) {
        return output;
    }

    if (!args.map) {
        return output;
    }

    return mapStackOutput<T>(output, args.map);
};
