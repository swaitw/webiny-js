import os from "os";
import logUpdate from "log-update";
import { bold, gray, green, red, yellow } from "chalk";

const EOL = os.EOL;
const HL = EOL + bold(gray("—")).repeat(62) + EOL;

const SECONDS_STILL_DEPLOYING_MESSAGE = 15;
const SECONDS_LONGER_THAN_EXPECTED_MESSAGE = 40;

class Log {
    public readonly message: string;
    public readonly createdOn: Date | null;

    public constructor(message: string = "", createdOn: Date | null = new Date()) {
        this.message = message;
        this.createdOn = createdOn;
    }
}

export interface IDeployment {
    status: string;
    statusUpdateInterval: NodeJS.Timeout | null;
    startedOn: Date | null;
    logs: Log[];
}

export interface ISimpleOutputLogParams {
    message: string;
    type: "build" | "logs" | "deploy";
}

export interface ISimpleOutputLogInitializeParams {
    build?: boolean;
    deploy?: boolean;
    showTimestamps?: boolean;
}

export interface ISimpleOutputStopDeployParams {
    error?: boolean;
}

export class SimpleOutput {
    private readonly logs: Log[] = [];
    private readonly deployment: IDeployment;
    private usesSingleLogType: boolean = false;
    private showTimestamps: boolean = false;

    public constructor() {
        this.usesSingleLogType = false;

        this.deployment = {
            status: gray("Automatic re-deployments enabled. Watching for code changes..."),
            statusUpdateInterval: null,
            startedOn: null,

            // We only print current deployment-related logs in case of an error.
            logs: []
        };
    }

    public initialize(args: ISimpleOutputLogInitializeParams): void {
        this.usesSingleLogType = (args.build ? 1 : 0) + (args.deploy ? 1 : 0) === 1;
        this.showTimestamps = !!args.showTimestamps;
    }

    public log({ message, type }: ISimpleOutputLogParams): void {
        message = message.trim().replace(/^\s+|\s+$/g, "");
        if (!message) {
            return;
        }

        // If only printing logs of a single log type, we don't need to do
        // anything special. Just printing them via `console.log` is enough.
        if (this.usesSingleLogType) {
            if (this.showTimestamps) {
                message = this.getTimestamp(new Date()) + " " + message;
            }
            console.log(message);
            return;
        }

        if (type === "build" || type === "logs") {
            this.logs.push(new Log(message));
            this.printLogs();
            return;
        }

        // Here we're dealing with deployment logs.
        switch (true) {
            case message.includes("Updating..."): {
                this.startDeploying();
                break;
            }
            case message.includes("Update complete."): {
                this.stopDeploying();
                break;
            }
            case message.includes("Update failed."): {
                this.stopDeploying({ error: true });
                break;
            }
            default:
                this.deployment.logs.push(new Log(message));
        }
    }

    public printLogs(): void {
        let update = this.logs
            .map(log => {
                let message = log.message;
                if (this.showTimestamps) {
                    const timestamp = this.getTimestamp(log.createdOn);
                    message = `${gray(timestamp)} ${message}`;
                }
                return message;
            })
            .join(EOL);

        update += HL;
        update += this.deployment.status;

        logUpdate(update);
    }

    private startDeploying(): void {
        this.deployment.logs = [];
        this.deployment.startedOn = new Date();

        let dotsCount = 3;
        this.deployment.statusUpdateInterval = setInterval(() => {
            if (dotsCount > 3) {
                dotsCount = 0;
            }

            const deployDuration = this.getDeploymentDuration();

            let message = "Deploying";
            if (deployDuration > SECONDS_STILL_DEPLOYING_MESSAGE) {
                message = "Still deploying";
            }

            if (deployDuration > SECONDS_LONGER_THAN_EXPECTED_MESSAGE) {
                message = "Deployment taking longer than expected, hold on";
            }

            let deploymentStatus = yellow(
                "‣ " + deployDuration + `s ‣ ${message}` + ".".repeat(dotsCount)
            );

            if (this.showTimestamps) {
                deploymentStatus =
                    gray(this.getTimestamp(this.deployment.startedOn)) + " " + deploymentStatus;
            }

            this.deployment.status = deploymentStatus;

            this.printLogs();

            dotsCount++;
        }, 500);
    }

    private stopDeploying({ error }: ISimpleOutputStopDeployParams = {}): void {
        const duration = this.getDeploymentDuration();
        let deploymentStatus = green("‣ " + duration + "s ‣ Deployment successful.");
        if (error) {
            deploymentStatus = red("‣ " + duration + "s ‣ Deployment failed.");
        }

        if (this.showTimestamps) {
            deploymentStatus = gray(this.getTimestamp(new Date())) + " " + deploymentStatus;
        }

        this.deployment.status = deploymentStatus;

        if (error) {
            this.logs.push(
                new Log("", null),
                new Log(red("Deployment failed.")),
                ...this.deployment.logs
            );
        } else {
            this.deployment.logs.push(new Log("Deployment finished."));
        }

        this.deployment.logs = [];
        if (error) {
            // In case of an error, we add a new line to separate the error message from the upcoming logs.
            this.deployment.logs = [new Log()];
        }

        this.deployment.startedOn = null;
        if (this.deployment.statusUpdateInterval) {
            clearInterval(this.deployment.statusUpdateInterval);
        }

        this.printLogs();
    }

    private getDeploymentDuration() {
        if (!this.deployment.startedOn) {
            return 0;
        }
        return Math.round((new Date().getTime() - this.deployment.startedOn.getTime()) / 1000);
    }

    private getTimestamp(date: Date | null) {
        return date ? date.toISOString().substring(11, 8) : this.getEmptyTimestampSpace();
    }

    private getEmptyTimestampSpace() {
        return " ".repeat(8);
    }
}

export default new SimpleOutput();
