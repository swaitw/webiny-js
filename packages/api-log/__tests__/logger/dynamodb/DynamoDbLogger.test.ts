import { createDynamoDbLogger } from "~/logger";
import { getTenant } from "~tests/mocks/getTenant";
import { getLocale } from "~tests/mocks/getLocale";
import { ILoggerLog, LogType } from "~/types";

jest.setTimeout(5000);

describe("DynamoDbLogger", () => {
    it("should one log per type log - autoflush", async () => {
        const logs: ILoggerLog[] = [];

        const onFlush = jest.fn(async (items: ILoggerLog[]): Promise<ILoggerLog[]> => {
            logs.push(...items);
            return items;
        });

        const tenant = getTenant();
        const locale = getLocale();

        const logger = createDynamoDbLogger({
            onFlush,
            getLocale,
            getTenant
        });

        logger.debug("source1", "log1");
        expect(logs).toEqual([]);
        expect(onFlush).toHaveBeenCalledTimes(0);
        logger.info("source2", "log2");
        expect(logs).toEqual([]);
        expect(onFlush).toHaveBeenCalledTimes(0);
        logger.warn("source3", "log3");
        expect(logs).toEqual([]);
        expect(onFlush).toHaveBeenCalledTimes(0);
        logger.notice("source4", "log4");
        expect(logs).toEqual([]);
        expect(onFlush).toHaveBeenCalledTimes(0);
        logger.error("source5", "log5");
        expect(logs).toEqual([]);
        expect(onFlush).toHaveBeenCalledTimes(0);
        /**
         * Should be empty as logs are flushed after N ms.
         */
        expect(logs).toEqual([]);
        /**
         * TODO: Increase when default timeout is changed.
         */
        await new Promise(resolve => setTimeout(resolve, 2000));

        expect(logs).toEqual([
            {
                id: expect.any(String),
                createdOn: expect.toBeDateString(),
                source: "source1",
                data: "log1",
                tenant,
                locale,
                type: LogType.DEBUG
            },
            {
                id: expect.any(String),
                createdOn: expect.toBeDateString(),
                source: "source2",
                data: "log2",
                tenant,
                locale,
                type: LogType.INFO
            },
            {
                id: expect.any(String),
                createdOn: expect.toBeDateString(),
                source: "source3",
                data: "log3",
                tenant,
                locale,
                type: LogType.WARN
            },
            {
                id: expect.any(String),
                createdOn: expect.toBeDateString(),
                source: "source4",
                data: "log4",
                tenant,
                locale,
                type: LogType.NOTICE
            },
            {
                id: expect.any(String),
                createdOn: expect.toBeDateString(),
                source: "source5",
                data: "log5",
                tenant,
                locale,
                type: LogType.ERROR
            }
        ]);
        /**
         * Make sure all types of logs are represented.
         */
        const types = Object.values(LogType);
        expect(types.length).toBeGreaterThan(1);
        for (const type of types) {
            expect(logs.filter(log => log.type === type)).toHaveLength(1);
        }

        const result = await logger.flush();
        /**
         * Should be empty as logs have already been flushed.
         */
        expect(result).toEqual([]);
    });

    it("should one log per type log - manual flush", async () => {
        const logs: ILoggerLog[] = [];

        const onFlush = jest.fn(async (items: ILoggerLog[]): Promise<ILoggerLog[]> => {
            logs.push(...items);
            return items;
        });

        const tenant = getTenant();
        const locale = getLocale();

        const logger = createDynamoDbLogger({
            onFlush,
            getLocale,
            getTenant
        });

        logger.debug("source1", "log1");
        expect(logs).toEqual([]);
        expect(onFlush).toHaveBeenCalledTimes(0);
        logger.info("source2", "log2");
        expect(logs).toEqual([]);
        expect(onFlush).toHaveBeenCalledTimes(0);
        logger.warn("source3", "log3");
        expect(logs).toEqual([]);
        expect(onFlush).toHaveBeenCalledTimes(0);
        logger.notice("source4", "log4");
        expect(logs).toEqual([]);
        expect(onFlush).toHaveBeenCalledTimes(0);
        logger.error("source5", "log5");
        expect(logs).toEqual([]);
        expect(onFlush).toHaveBeenCalledTimes(0);

        await logger.flush();

        expect(onFlush).toHaveBeenCalledTimes(1);

        expect(logs).toEqual([
            {
                id: expect.any(String),
                createdOn: expect.toBeDateString(),
                source: "source1",
                data: "log1",
                tenant,
                locale,
                type: LogType.DEBUG
            },
            {
                id: expect.any(String),
                createdOn: expect.toBeDateString(),
                source: "source2",
                data: "log2",
                tenant,
                locale,
                type: LogType.INFO
            },
            {
                id: expect.any(String),
                createdOn: expect.toBeDateString(),
                source: "source3",
                data: "log3",
                tenant,
                locale,
                type: LogType.WARN
            },
            {
                id: expect.any(String),
                createdOn: expect.toBeDateString(),
                source: "source4",
                data: "log4",
                tenant,
                locale,
                type: LogType.NOTICE
            },
            {
                id: expect.any(String),
                createdOn: expect.toBeDateString(),
                source: "source5",
                data: "log5",
                tenant,
                locale,
                type: LogType.ERROR
            }
        ]);
        /**
         * Make sure all types of logs are represented.
         */
        const types = Object.values(LogType);
        expect(types.length).toBeGreaterThan(1);
        for (const type of types) {
            expect(logs.filter(log => log.type === type)).toHaveLength(1);
        }

        const result = await logger.flush();

        expect(onFlush).toHaveBeenCalledTimes(1);
        /**
         * Should be empty as logs have already been flushed.
         */
        expect(result).toEqual([]);
    });
});
