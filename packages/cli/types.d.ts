import type yargs from "yargs";

/**
 * Rename file to types.ts when switching the package to Typescript.
 */
export type GenericRecord<K extends PropertyKey = PropertyKey, V = any> = Record<K, V>;

export type NonEmptyArray<T> = [T, ...T[]];

/**
 * A simplified plugins container interface, used specifically within the Webiny CLI.
 * Not in relation with "@webiny/plugins" package.
 */
export interface PluginsContainer {
    register(...args: any[]): void;
    byType<T extends Plugin>(type: T["type"]): T[];

    byName<T extends Plugin>(name: T["name"]): T;
}

/**
 * A simplified plugin interface, used specifically within the Webiny CLI.
 * Not in relation with "@webiny/plugins" package.
 */
export interface Plugin {
    type: string;
    name?: string;

    [key: string]: any;
}

interface Project {
    /**
     * Name of the project.
     */
    name: string;
    /**
     * Configurations.
     */
    config: {
        appAliases: {
            [key: string]: string;
        }
        [key: string]: any;
    };
    /**
     * Root path of the project.
     */
    root: string;
}


export interface IProjectApplicationPackage {
    name: string;
    paths: {
        root: string;
        relative: string;
        packageJson: string;
        config: string;
    };
    packageJson: Record<string, any>;
    get config(): any;
}

export interface IProjectApplicationConfigCli {
    watch?: boolean;
}

export interface IProjectApplicationConfig {
    appAliases?: Record<string, string>;
    cli?: IProjectApplicationConfigCli;
    [key: string]: unknown
}

export interface ProjectApplication {
    /**
     * Unique ID of the project application.
     */
    id: string;
    /**
     * Name of the project application.
     */
    name: string;
    /**
     * Description of the project application.
     */
    description: string;
    /**
     * Type of the project application.
     */
    type: string;
    /**
     * Root path of the project application.
     */
    root: string;
    /**
     * Commonly used paths.
     */
    paths: {
        relative: string;
        absolute: string;
        workspace: string;
    };
    /**
     * Project application config (exported via `webiny.application.ts` file).
     */
    config: IProjectApplicationConfig;
    /**
     * Project application package.json.
     */
    project: Project;

    /**
     * A list of all the packages in the project application.
     */
    get packages(): IProjectApplicationPackage[];
}

/**
 * A type that represents the logging method.
 */
interface Log {
    (...args: any): string;

    hl: (...args: any) => string;
    highlight: (...args: any) => string;
}

/**
 * Interface representing the CLI Context.
 */
export interface CliContext {
    /**
     * All registered plugins.
     */
    plugins: PluginsContainer;
    /**
     * Load environment variables from a given file.
     */
    loadEnv(filePath: string, options?: {debug?: boolean}): Promise<void>;
    /**
     * All the environment variables.
     */
    loadedEnvFiles: Record<string, any>;
    /**
     * Version of the Webiny CLI.
     */
    version: string;
    /**
     * Project information.
     */
    project: Project;
    /**
     * Trigger given callback on SIGINT.
     */
    onExit: (cb: () => any) => void;
    /**
     * Import a given module.
     */
    import: (module: string) => Promise<void>;
    /**
     * Regular logging.
     */
    log: Log;
    /**
     * Info logging.
     */
    info: Log;
    /**
     * Success logging.
     */
    success: Log;
    /**
     * Debug logging.
     */
    debug: Log;
    /**
     * Warnings logging.
     */
    warning: Log;
    /**
     * Errors logging.
     */
    error: Log;
    /**
     * Resolve given dir or dirs against project root path.
     */
    resolve: (dir: string) => string;

    /**
     * Provides a way to store some metadata in the project's local ".webiny/cli.json" file.
     * Only trivial data should be passed here, specific to the current project.
     */
    localStorage: {
        set: (key: string, value: any) => Record<string, any>;
        get: (key: string) => any;
    };
}

/**
 * Arguments for CliPlugin.create
 *
 * @category Cli
 */
export interface CliCommandPluginArgs {
    yargs: typeof yargs;
    context: CliContext;
}

/**
 * A plugin defining cli-command type.
 *
 * @category Plugin
 * @category Cli
 */
export interface CliCommandPlugin extends Plugin {
    type: "cli-command";
    name: string;
    create: (args: CliCommandPluginArgs) => void;
}

export interface CliCommandErrorPluginHandleParams {
    context: CliContext;
    error: Error;
}

export interface CliCommandErrorPluginHandle {
    (params: CliCommandErrorPluginHandleParams):void;
}

export interface CliCommandErrorPlugin extends Plugin {
    type: "cli-command-error";
    handle: CliCommandErrorPluginHandle;
}
