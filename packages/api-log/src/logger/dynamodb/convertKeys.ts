import { GenericRecord } from "@webiny/api/types";

export const convertLastEvaluatedKeyToAfterKey = (
    lastEvaluatedKey?: GenericRecord
): string | null => {
    if (!lastEvaluatedKey) {
        return null;
    }
    try {
        const json = JSON.stringify(lastEvaluatedKey);
        return Buffer.from(json).toString("base64");
    } catch (ex) {
        console.error("Failed to convert last evaluated key to after.");
        console.log(ex);
        return null;
    }
};

export const convertAfterToStartKey = (after?: string | null): GenericRecord | undefined => {
    if (!after) {
        return undefined;
    }
    try {
        const json = Buffer.from(after, "base64").toString("utf-8");
        const result = JSON.parse(json);
        if (!result || typeof result !== "object") {
            return undefined;
        }
        return result || undefined;
    } catch (ex) {
        console.error("Failed to convert after to start key.");
        console.log(ex);
        return undefined;
    }
};
