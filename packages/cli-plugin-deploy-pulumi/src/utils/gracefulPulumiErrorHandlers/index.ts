import {
    pendingOperationsInfo,
    IPendingOperationsInfoParamsContext
} from "./pendingOperationsInfo";
import { ddbPutItemConditionalCheckFailed } from "./ddbPutItemConditionalCheckFailed";
import { missingFilesInBuild } from "./missingFilesInBuild";

export interface Context extends IPendingOperationsInfoParamsContext {}

export const gracefulPulumiErrorHandlers = [
    ddbPutItemConditionalCheckFailed,
    missingFilesInBuild,
    pendingOperationsInfo
];
