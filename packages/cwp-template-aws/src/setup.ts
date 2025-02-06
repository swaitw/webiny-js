import fs from "fs-extra";
import path from "path";
import execa from "execa";
import crypto from "crypto";
import { renames } from "./setup/renames";
import merge from "lodash/merge";
import writeJsonFile from "write-json-file";
import type { PackageJson } from "type-fest";
import loadJsonFile from "load-json-file";
// @ts-expect-error
import getPackages from "get-yarn-workspaces";
import { yellow } from "chalk";
import ora from "ora";

const IS_TEST = process.env.NODE_ENV === "test";

function getDefaultRegion(): string {
    return process.env.AWS_REGION || "us-east-1";
}

function random(length: number = 32): string {
    return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString("hex")
        .slice(0, length);
}

export interface ISetupParams {
    isGitAvailable: boolean;
    projectRoot: string;
    projectName: string;
    templateOptions: {
        region?: string;
        storageOperations?: string;
    };
    /**
     * @internal
     *
     * Used for testing.
     */
    overrideDirname?: string;
}

export const setup = async (params: ISetupParams) => {
    const {
        isGitAvailable,
        projectRoot,
        projectName,
        templateOptions = {},
        overrideDirname
    } = params;
    const { region = getDefaultRegion(), storageOperations = "ddb" } = templateOptions;
    /**
     * We need to check for the existence of the common and storageOperations folders to continue.
     */
    if (!storageOperations) {
        console.log("Missing storage operations parameter.");
        process.exit(1);
    }

    const commonTemplate = path.join(overrideDirname || __dirname, `template/common`);
    const storageOperationsTemplate = path.join(
        overrideDirname || __dirname,
        `template/${storageOperations}`
    );
    if (!fs.existsSync(commonTemplate)) {
        console.log(`Missing common template folder "${commonTemplate}".`);
        process.exit(1);
    } else if (!fs.existsSync(storageOperationsTemplate)) {
        console.log(
            `Missing storage operations "${storageOperations}" template folder "${storageOperationsTemplate}".`
        );
        process.exit(1);
    }

    /**
     * Then we copy the common template folder and selected storage operations folder.
     */
    fs.copySync(commonTemplate, projectRoot);
    fs.copySync(storageOperationsTemplate, projectRoot);

    for (let i = 0; i < renames.length; i++) {
        fs.moveSync(
            path.join(projectRoot, renames[i].prev),
            path.join(projectRoot, renames[i].next),
            {
                overwrite: true
            }
        );
    }

    const dependenciesJsonPath = path.join(projectRoot, "dependencies.json");
    const packageJsonPath = path.join(projectRoot, "package.json");

    const dependenciesJson = await loadJsonFile(dependenciesJsonPath);
    const packageJson = await loadJsonFile(packageJsonPath);

    merge(packageJson, dependenciesJson);

    await writeJsonFile(packageJsonPath, packageJson);

    await fs.removeSync(dependenciesJsonPath);
    /**
     * Had to change from ./package.json to full path, because package.json does not exist in the src folder during development / testing.
     */
    const { name, version } = require("@webiny/cwp-template-aws/package.json");

    if (!IS_TEST && isGitAvailable) {
        // Commit .gitignore.
        try {
            execa.sync("git", ["add", ".gitignore"], { cwd: projectRoot });
            execa.sync("git", ["commit", "-m", `chore: initialize .gitignore`], {
                cwd: projectRoot
            });
        } catch (e) {
            console.log(
                yellow(
                    "Failed to commit .gitignore. You will have to do it manually once the project is created."
                )
            );
        }
    }

    const rootEnvFilePath = path.join(projectRoot, ".env");
    let content = fs.readFileSync(rootEnvFilePath).toString();
    content = content.replace("{REGION}", region);
    content = content.replace("{PULUMI_CONFIG_PASSPHRASE}", random());
    content = content.replace("{PULUMI_SECRETS_PROVIDER}", "passphrase");
    fs.writeFileSync(rootEnvFilePath, content);

    let projectFile = fs.readFileSync(path.join(projectRoot, "webiny.project.ts"), "utf-8");
    projectFile = projectFile.replace("[PROJECT_NAME]", projectName);
    projectFile = projectFile.replace("[TEMPLATE_VERSION]", `${name}@${version}`);
    fs.writeFileSync(path.join(projectRoot, "webiny.project.ts"), projectFile);

    // Adjust versions - change them from `latest` to current one.
    const latestVersion = version;

    const workspaces = [projectRoot, ...getPackages(projectRoot)];

    for (let i = 0; i < workspaces.length; i++) {
        const packageJsonPath = path.join(workspaces[i], "package.json");
        const packageJson = await loadJsonFile<Required<PackageJson>>(packageJsonPath);
        const depsList = Object.keys(packageJson.dependencies).filter(name => {
            return name.startsWith("@webiny");
        });

        depsList.forEach(name => {
            packageJson.dependencies[name] = latestVersion;
        });

        await writeJsonFile(packageJsonPath, packageJson);
    }

    if (IS_TEST) {
        return;
    }

    // Install dependencies.
    console.log();
    const spinner = ora("Installing packages...").start();
    try {
        const subprocess = execa("yarn", [], {
            cwd: projectRoot,
            maxBuffer: 500_000_000
        });
        await subprocess;
        spinner.succeed("Packages installed successfully.");
    } catch (e) {
        spinner.fail("Failed to install packages.");

        console.log(e.message);

        throw new Error(
            "Failed while installing project dependencies. Please check the above Yarn logs for more information.",
            { cause: e }
        );
    }
};
