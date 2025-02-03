import {
    Callable,
    PulumiCommandLifecycleEventHookPlugin
} from "./PulumiCommandLifecycleEventHookPlugin";

export class AfterDeployPlugin extends PulumiCommandLifecycleEventHookPlugin {
    public static override type = "hook-after-deploy";
}

export const createAfterDeployPlugin = (callable: Callable) => {
    return new AfterDeployPlugin(callable);
};
