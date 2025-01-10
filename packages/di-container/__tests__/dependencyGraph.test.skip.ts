// @ts-nocheck This is WIP
import { Container, DependencyGraph, Abstraction, createImplementation } from "~/index";
import { printGraph } from "./printGraph";

interface ILogger {
    log(...args: unknown[]): void;
}

class ConsoleLogger implements ILogger {
    log(...args: unknown[]): void {
        console.log("ConsoleLogger:", ...args);
    }
}

class FileLogger implements ILogger {
    log(...args: unknown[]): void {
        console.log("FileLogger:", ...args);
    }
}
test("should generate a complex nested dependency graph with multiple levels and vertical lines", () => {
    const rootContainer = new Container();

    // Level 1 - Logger Implementations
    const LoggerAbstraction = new Abstraction<ILogger>("Logger");
    const consoleLoggerImpl = createImplementation({
        abstraction: LoggerAbstraction,
        implementation: ConsoleLogger,
        dependencies: []
    });
    const fileLoggerImpl = createImplementation({
        abstraction: LoggerAbstraction,
        implementation: FileLogger,
        dependencies: []
    });
    rootContainer.register(consoleLoggerImpl);
    rootContainer.register(fileLoggerImpl);

    // Level 2 - LoggerManager depends on multiple ILogger implementations
    class LoggerManager {
        constructor(public loggers: ILogger[]) {}
    }
    const loggerManagerAbstraction = new Abstraction<LoggerManager>("LoggerManager");
    const loggerManagerImpl = createImplementation({
        abstraction: loggerManagerAbstraction,
        implementation: LoggerManager,
        dependencies: [[LoggerAbstraction, { multiple: true }]]
    });
    rootContainer.register(loggerManagerImpl);

    // Level 3 - Database dependency and ServiceManager
    class Database {
        connect() {
            console.log("Connecting to database");
        }
    }
    const databaseAbstraction = new Abstraction<Database>("Database");
    const databaseImpl = createImplementation({
        abstraction: databaseAbstraction,
        implementation: Database,
        dependencies: []
    });
    rootContainer.register(databaseImpl);

    class ServiceManager {
        constructor(public loggerManager: LoggerManager, public database: Database) {}
    }
    const serviceManagerAbstraction = new Abstraction<ServiceManager>("ServiceManager");
    const serviceManagerImpl = createImplementation({
        abstraction: serviceManagerAbstraction,
        implementation: ServiceManager,
        dependencies: [loggerManagerAbstraction, databaseAbstraction]
    });
    rootContainer.register(serviceManagerImpl);

    // Level 4 - AppManager depends on ServiceManager
    class AppManager {
        constructor(public serviceManager: ServiceManager) {}
    }
    const appManagerAbstraction = new Abstraction<AppManager>("AppManager");
    const appManagerImpl = createImplementation({
        abstraction: appManagerAbstraction,
        implementation: AppManager,
        dependencies: [serviceManagerAbstraction]
    });
    rootContainer.register(appManagerImpl);

    // Build and print the dependency graph starting from AppManager
    const dependencyGraph = new DependencyGraph(rootContainer);
    const graph = dependencyGraph.buildGraph(appManagerImpl);
    const graphOutput = printGraph(graph);
    console.log(graphOutput);
});
