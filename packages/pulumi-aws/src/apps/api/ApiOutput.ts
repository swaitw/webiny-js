import { createAppModule, PulumiAppModule } from "@webiny/pulumi";
import { getStackOutput } from "@webiny/cli-plugin-deploy-pulumi/utils";

export type ApiOutput = PulumiAppModule<typeof ApiOutput>;

export const ApiOutput = createAppModule({
    name: "ApiOutput",
    config(app) {
        return app.addHandler(async () => {
            const output = getStackOutput({
                folder: "apps/api",
                env: app.params.run.env,
                variant: app.params.run.variant
            });

            if (!output) {
                throw new Error("API application is not deployed.");
            }

            return {
                apiDomain: output["apiDomain"],
                apiUrl: output["apiUrl"],
                graphqlLambdaRole: output["graphqlLambdaRole"],
                apwSchedulerEventRule: output["apwSchedulerEventRule"],
                apwSchedulerEventTargetId: output["apwSchedulerEventTargetId"],
                apwSchedulerExecuteAction: output["apwSchedulerExecuteAction"],
                apwSchedulerScheduleAction: output["apwSchedulerScheduleAction"],
                cognitoAppClientId: output["cognitoAppClientId"],
                cognitoUserPoolId: output["cognitoUserPoolId"],
                cognitoUserPoolPasswordPolicy: output["cognitoUserPoolPasswordPolicy"],
                dynamoDbTable: output["dynamoDbTable"],
                region: output["region"],
                websocketApiUrl: output["websocketApiUrl"]
            };
        });
    }
});
