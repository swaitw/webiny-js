import { mdbid } from "@webiny/utils";
import { DynamoDbLoggerKeys } from "~/logger";
import { LogType } from "~/types";
import { getTenant } from "~tests/mocks/getTenant";

describe("DynamoDbLoggerKeys", () => {
    it("should create keys", async () => {
        const keys = new DynamoDbLoggerKeys();

        const id = mdbid();
        const tenant = getTenant();
        const source = "some-source";
        const type = LogType.ERROR;
        const result = keys.create({
            id,
            tenant,
            source,
            type
        });

        expect(result).toEqual({
            PK: "LOG",
            SK: id,
            GSI1_PK: `SOURCE#${source}#LOG`,
            GSI1_SK: id,
            GSI2_PK: `TYPE#${type}#LOG`,
            GSI2_SK: id,
            GSI3_PK: `T#${tenant}#LOG`,
            GSI3_SK: id,
            GSI4_PK: `T#${tenant}#SOURCE#${source}#LOG`,
            GSI4_SK: id,
            GSI5_PK: `T#${tenant}#TYPE#${type}#LOG`,
            GSI5_SK: id
        });
    });
});
