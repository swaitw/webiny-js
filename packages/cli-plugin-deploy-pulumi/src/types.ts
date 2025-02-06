export {
    CliContext as Context,
    ProjectApplication,
    IProjectApplicationPackage,
    Project
} from "@webiny/cli/types";

import type { Pulumi } from "@webiny/pulumi-sdk";

export type IPulumi = Pulumi;

export interface IUserCommandInput {
    env: string;
    folder: string;
    region: string | undefined;
    variant: string | undefined;
    allowLocalStateFiles?: boolean;
    debug?: boolean;
    cwd?: string;
    telemetry?: boolean;
    logs?: boolean;
    json?: boolean;
    build?: boolean;
    deploy?: boolean;
    package?: string;
    preview?: boolean;
    inspect?: boolean;
    depth?: number;
    allowProduction?: boolean;
    increaseTimeout?: number;
    deploymentLogs?: boolean;
    _: (string | boolean | number)[];
}
