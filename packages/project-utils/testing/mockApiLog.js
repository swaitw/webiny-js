const { ContextPlugin } = require("@webiny/api");

export const createMockApiLog = () => {
    const logging = {
        notice: () => {
            return;
        },
        debug: () => {
            return;
        },
        info: () => {
            return;
        },
        warn: () => {
            return;
        },
        error: () => {
            return;
        }
    };
    return {
        async flush() {
            return [];
        },
        withSource: () => {
            return logging;
        },
        ...logging
    };
};

export const createMockApiLogContextPlugin = () => {
    return new ContextPlugin(async context => {
        context.logger = {
            ...createMockApiLog()
        };
    });
};
