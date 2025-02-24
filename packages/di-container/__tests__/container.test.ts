import { Container, Abstraction, createImplementation, createDecorator } from "~/index";

// Mock implementations for testing
interface ILogger {
    log(...args: unknown[]): void;
}

interface IFormatter {
    format(message: string): string;
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

class UpperCaseFormatter implements IFormatter {
    format(message: string): string {
        return message.toUpperCase();
    }
}

describe("DIContainer", () => {
    let rootContainer: Container;
    const LoggerAbstraction = new Abstraction<ILogger>("Logger");
    const FormatterAbstraction = new Abstraction<IFormatter>("Formatter");

    beforeEach(() => {
        rootContainer = new Container();
    });

    test("should register and resolve an implementation as Transient (default)", () => {
        const consoleLoggerImpl = createImplementation({
            abstraction: LoggerAbstraction,
            implementation: ConsoleLogger,
            dependencies: []
        });

        rootContainer.register(consoleLoggerImpl);

        const logger1 = rootContainer.resolve(LoggerAbstraction);
        const logger2 = rootContainer.resolve(LoggerAbstraction);

        expect(logger1).not.toBe(logger2); // Different instances each time
    });

    test("should register and resolve an implementation as Singleton", () => {
        const consoleLoggerImpl = createImplementation({
            abstraction: LoggerAbstraction,
            implementation: ConsoleLogger,
            dependencies: []
        });
        rootContainer.register(consoleLoggerImpl).inSingletonScope();

        const logger1 = rootContainer.resolve(LoggerAbstraction);
        const logger2 = rootContainer.resolve(LoggerAbstraction);

        expect(logger1).toBe(logger2); // Same instance each time
    });

    test("should resolve instance from parent container if not found in child container", () => {
        const consoleLoggerImpl = createImplementation({
            abstraction: LoggerAbstraction,
            implementation: ConsoleLogger,
            dependencies: []
        });
        rootContainer.register(consoleLoggerImpl).inSingletonScope();

        const childContainer = rootContainer.createChildContainer();
        const loggerFromChild = childContainer.resolve(LoggerAbstraction);

        const loggerFromRoot = rootContainer.resolve(LoggerAbstraction);
        expect(loggerFromChild).toBe(loggerFromRoot); // Resolved from parent container
    });

    test("should resolve multiple implementations of the same abstraction when multiple flag is used", () => {
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

        class LoggerManager {
            constructor(public loggers: ILogger[]) {}
        }

        const managerAbstraction = new Abstraction<LoggerManager>("LoggerManager");

        const managerImpl = createImplementation({
            abstraction: managerAbstraction,
            implementation: LoggerManager,
            dependencies: [[LoggerAbstraction, { multiple: true }]]
        });

        rootContainer.register(managerImpl);

        const manager = rootContainer.resolve(managerAbstraction);
        expect(manager.loggers.length).toBe(2);
        expect(manager.loggers.some(logger => logger instanceof ConsoleLogger)).toBe(true);
        expect(manager.loggers.some(logger => logger instanceof FileLogger)).toBe(true);
    });

    test("should apply decorators to implementation", () => {
        class LoggerDecorator implements ILogger {
            constructor(private decoratee: ILogger) {}

            log(...args: unknown[]): void {
                console.log("Decorated:");
                this.decoratee.log(...args);
            }
        }

        const consoleLoggerImpl = createImplementation({
            abstraction: LoggerAbstraction,
            implementation: ConsoleLogger,
            dependencies: []
        });
        rootContainer.register(consoleLoggerImpl);

        const loggerDecorator = createDecorator({
            abstraction: LoggerAbstraction,
            decorator: LoggerDecorator,
            dependencies: []
        });

        rootContainer.registerDecorator(loggerDecorator);

        const logger = rootContainer.resolve(LoggerAbstraction);
        expect(logger).toBeInstanceOf(LoggerDecorator);
    });

    test("should register and resolve a pre-instantiated object as Singleton", () => {
        const preInstantiatedLogger = new FileLogger();

        rootContainer.registerInstance(LoggerAbstraction, preInstantiatedLogger);

        const resolvedLogger1 = rootContainer.resolve(LoggerAbstraction);
        const resolvedLogger2 = rootContainer.resolve(LoggerAbstraction);

        expect(resolvedLogger1).toBe(preInstantiatedLogger);
        expect(resolvedLogger1).toBe(resolvedLogger2); // Singleton behavior
    });

    test("should apply decorators to pre-instantiated object", () => {
        class LoggerDecorator implements ILogger {
            constructor(private decoratee: ILogger) {}

            log(...args: unknown[]): void {
                console.log("Decorated:");
                this.decoratee.log(...args);
            }
        }

        const preInstantiatedLogger = new ConsoleLogger();
        rootContainer.registerInstance(LoggerAbstraction, preInstantiatedLogger);

        const loggerDecorator = createDecorator({
            abstraction: LoggerAbstraction,
            decorator: LoggerDecorator,
            dependencies: []
        });

        rootContainer.registerDecorator(loggerDecorator);

        const decoratedLogger = rootContainer.resolve(LoggerAbstraction);
        expect(decoratedLogger).toBeInstanceOf(LoggerDecorator);

        // Verify that the decorator actually calls the original implementation
        const consoleSpy = jest.spyOn(console, "log");
        decoratedLogger.log("Testing decorator on instance");
        expect(consoleSpy).toHaveBeenCalledWith("Decorated:");
        expect(consoleSpy).toHaveBeenCalledWith("ConsoleLogger:", "Testing decorator on instance");
        consoleSpy.mockRestore();
    });

    test("should resolve multiple instances when both class-based and pre-instantiated registrations exist", () => {
        const consoleLoggerImpl = createImplementation({
            abstraction: LoggerAbstraction,
            implementation: ConsoleLogger,
            dependencies: []
        });
        rootContainer.register(consoleLoggerImpl);

        const fileLoggerInstance = new FileLogger();
        rootContainer.registerInstance(LoggerAbstraction, fileLoggerInstance);

        class LoggerManager {
            constructor(public loggers: ILogger[]) {}
        }

        const managerAbstraction = new Abstraction<LoggerManager>("LoggerManager");

        const managerImpl = createImplementation({
            abstraction: managerAbstraction,
            implementation: LoggerManager,
            dependencies: [[LoggerAbstraction, { multiple: true }]]
        });

        rootContainer.register(managerImpl);

        const manager = rootContainer.resolve(managerAbstraction);
        expect(manager.loggers.length).toBe(2);
        expect(manager.loggers.some(logger => logger instanceof ConsoleLogger)).toBe(true);
        expect(manager.loggers.some(logger => logger === fileLoggerInstance)).toBe(true);
    });

    test("should resolve dependencies and instantiate any given class", () => {
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

        class LoggerManager {
            constructor(public loggers: ILogger[]) {}
        }

        const manager = rootContainer.resolveWithDependencies({
            implementation: LoggerManager,
            dependencies: [[LoggerAbstraction, { multiple: true }]]
        });

        expect(manager.loggers.length).toBe(2);
        expect(manager.loggers.some(logger => logger instanceof ConsoleLogger)).toBe(true);
        expect(manager.loggers.some(logger => logger instanceof FileLogger)).toBe(true);
    });

    test("should apply decorators with dependencies", () => {
        // Register formatter implementation
        const formatterImpl = createImplementation({
            abstraction: FormatterAbstraction,
            implementation: UpperCaseFormatter,
            dependencies: []
        });
        rootContainer.register(formatterImpl);

        // Register logger implementation
        const consoleLoggerImpl = createImplementation({
            abstraction: LoggerAbstraction,
            implementation: ConsoleLogger,
            dependencies: []
        });
        rootContainer.register(consoleLoggerImpl);

        // Create a decorator that uses both a formatter and the decoratee
        class FormattingLoggerDecorator implements ILogger {
            constructor(private formatter: IFormatter, private decoratee: ILogger) {}

            log(...args: unknown[]): void {
                const formattedArgs = args.map(arg =>
                    typeof arg === "string" ? this.formatter.format(arg) : arg
                );
                this.decoratee.log(...formattedArgs);
            }
        }

        const formattingLoggerDecorator = createDecorator({
            abstraction: LoggerAbstraction,
            decorator: FormattingLoggerDecorator,
            dependencies: [FormatterAbstraction]
        });

        rootContainer.registerDecorator(formattingLoggerDecorator);

        const logger = rootContainer.resolve(LoggerAbstraction);
        expect(logger).toBeInstanceOf(FormattingLoggerDecorator);

        // Verify that the decorator uses both the formatter and the decoratee
        const consoleSpy = jest.spyOn(console, "log");
        logger.log("hello world");
        expect(consoleSpy).toHaveBeenCalledWith("ConsoleLogger:", "HELLO WORLD");
        consoleSpy.mockRestore();
    });
});
