import projectApplication from "../webiny.application";

export = async () => {
    return projectApplication.pulumi.run({
        env: "{DEPLOY_ENV}",
        variant: "{DEPLOY_VARIANT}"
    });
};
