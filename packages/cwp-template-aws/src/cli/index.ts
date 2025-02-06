import type { Plugin } from "@webiny/cli/types";
import { deployAllCommand } from "./deploy";
import { destroyAllCommand } from "./destroy";
import { openCommand } from "./open";
import { infoCommand } from "./info";
import { checkCredentialsHook, subscriptionRequiredException } from "./aws";

export default (): Plugin[] => [
    openCommand,
    deployAllCommand,
    destroyAllCommand,
    infoCommand,
    checkCredentialsHook,
    subscriptionRequiredException
];
