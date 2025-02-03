import path from "path";
import { Worker } from "worker_threads";
import Listr from "listr";
import { BasePackagesBuilder } from "./BasePackagesBuilder";
import { gray } from "chalk";
import { measureDuration } from "~/utils";
import { IProjectApplicationPackage } from "@webiny/cli/types";

export class MultiplePackagesBuilder extends BasePackagesBuilder {
    public override async build(): Promise<void> {
        const packages = this.packages;
        const context = this.context;
        const inputs = this.inputs;

        const getBuildDuration = measureDuration();

        const { env, variant, debug } = inputs;

        context.info(`Building %s packages...`, packages.length);

        const buildTasks = [];

        for (let i = 0; i < packages.length; i++) {
            const pkg = packages[i];

            buildTasks.push({
                pkg: pkg,
                task: new Promise((resolve, reject) => {
                    const enableLogs = inputs.logs === true;

                    const workerData = {
                        options: {
                            env,
                            variant,
                            debug,
                            logs: enableLogs
                        },
                        package: { ...pkg.paths }
                    };

                    const worker = new Worker(path.join(__dirname, "./worker.js"), {
                        workerData,
                        stderr: true,
                        stdout: true
                    });

                    worker.on("message", threadMessage => {
                        const { type, stdout, stderr, error } = JSON.parse(threadMessage);

                        const result = {
                            package: pkg,
                            stdout,
                            stderr,
                            error,
                            duration: getBuildDuration()
                        };

                        if (type === "error") {
                            reject(result);
                            return;
                        }

                        if (type === "success") {
                            resolve(result);
                        }
                    });
                })
            });
        }

        const tasks = new Listr(
            buildTasks.map(({ pkg, task }) => {
                return {
                    title: this.getPackageLabel(pkg),
                    task: () => task
                };
            }),
            { concurrent: true, exitOnError: false }
        );

        await tasks.run().catch(err => {
            console.log();
            context.error(`Failed to build all packages. For more details, check the logs below.`);
            console.log();
            /**
             * Seems List package has wrong types or this never worked.
             */
            // @ts-expect-error
            err.errors.forEach(({ package: pkg, error }, i) => {
                const number = `${i + 1}.`;
                const name = context.error.hl(pkg.name);
                const relativePath = gray(`(${pkg.paths.relative})`);
                const title = [number, name, relativePath].join(" ");

                console.log(title);
                console.log(error.message);
                console.log();
            });

            throw new Error(`Failed to build all packages.`);
        });

        console.log();

        context.success(`Built ${packages.length} packages in ${getBuildDuration()}.`);
    }

    private getPackageLabel(pkg: IProjectApplicationPackage): string {
        const pkgName = pkg.name;
        const pkgRelativePath = gray(`(${pkg.paths.relative})`);
        return `${pkgName} ${pkgRelativePath}`;
    }
}
