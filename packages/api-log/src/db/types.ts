import { Table as DynamoDbTable } from "@webiny/db-dynamodb/toolbox";

export type ITable = DynamoDbTable<string, "PK", "SK">;
