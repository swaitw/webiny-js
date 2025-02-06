import inquirer from "inquirer";
import type { ISetupParams } from "./setup";
import { setup } from "./setup";
import { regions } from "@webiny/cli";

const choices = {
    ddb: {
        value: "ddb",
        name: "DynamoDB (for small and medium sized projects)"
    },
    ddbOs: {
        value: "ddb-os",
        name: "Amazon DynamoDB + Amazon OpenSearch (for larger projects)"
    }
};

interface IRunInquirerParams extends ISetupParams {
    interactive: boolean;
}

const runInquirer = async (cwp: IRunInquirerParams) => {
    if (!cwp.interactive) {
        return setup(cwp);
    }

    console.log(
        "In order to create your new Webiny project, please answer the following questions."
    );
    console.log();

    const templateOptions = await inquirer.prompt([
        {
            type: "list",
            name: "region",
            default: "us-east-1",
            message: "Please choose the AWS region in which your project will be deployed:",
            // Some of the regions might be commented out (not all service supported).
            choices: regions
        },
        {
            type: "list",
            name: "storageOperations",
            default: "ddb",
            message: `Please choose the database setup you wish to use with your project (cannot be changed later):`,
            choices: Object.values(choices)
        }
    ]);

    return setup({
        ...cwp,
        templateOptions
    });
};

export default runInquirer;
