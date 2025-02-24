import { ILoggerLog } from "~/types";

export interface IDynamoDbLoggerKeysCreateResponse {
    PK: string;
    SK: string;
    GSI1_PK: string;
    GSI1_SK: string;
    GSI2_PK: string;
    GSI2_SK: string;
    GSI3_PK: string;
    GSI3_SK: string;
    GSI4_PK: string;
    GSI4_SK: string;
    GSI5_PK: string;
    GSI5_SK: string;
}

export class DynamoDbLoggerKeys {
    public create(
        item: Pick<ILoggerLog, "id" | "tenant" | "source" | "type">
    ): IDynamoDbLoggerKeysCreateResponse {
        return {
            PK: this.createPartitionKey(),
            SK: this.createSortKey(item),
            GSI1_PK: this.createSourcePartitionKey(item),
            GSI1_SK: this.createSourceSortKey(item),
            GSI2_PK: this.createTypePartitionKey(item),
            GSI2_SK: this.createTypeSortKey(item),
            /**
             * Tenant specific.
             */
            GSI3_PK: this.createTenantPartitionKey(item),
            GSI3_SK: this.createTenantSortKey(item),
            GSI4_PK: this.createTenantAndSourcePartitionKey(item),
            GSI4_SK: this.createTenantAndSourceSortKey(item),
            GSI5_PK: this.createTenantAndTypePartitionKey(item),
            GSI5_SK: this.createTenantAndTypeSortKey(item)
        };
    }
    /**
     * Query for all logs or one by ID.
     */
    public createPartitionKey(): string {
        return `LOG`;
    }

    public createSortKey(item: Pick<ILoggerLog, "id">): string {
        return item.id;
    }
    /**
     * Query for all logs from a source.
     */
    public createSourcePartitionKey(item: Pick<ILoggerLog, "source">): string {
        return `SOURCE#${item.source}#LOG`;
    }

    public createSourceSortKey(item: Pick<ILoggerLog, "id">): string {
        return item.id;
    }
    /**
     * Query for all logs of a certain type.
     */
    public createTypePartitionKey(item: Pick<ILoggerLog, "type">): string {
        return `TYPE#${item.type}#LOG`;
    }

    public createTypeSortKey(item: Pick<ILoggerLog, "id">): string {
        return item.id;
    }
    /**
     * Query for all logs by tenant.
     */
    public createTenantPartitionKey(item: Pick<ILoggerLog, "tenant">): string {
        return `T#${item.tenant}#LOG`;
    }

    public createTenantSortKey(item: Pick<ILoggerLog, "id">): string {
        return item.id;
    }

    /**
     * Query for all logs by tenant + source.
     */
    public createTenantAndSourcePartitionKey(item: Pick<ILoggerLog, "tenant" | "source">): string {
        return `T#${item.tenant}#SOURCE#${item.source}#LOG`;
    }

    public createTenantAndSourceSortKey(item: Pick<ILoggerLog, "id">): string {
        return item.id;
    }

    /**
     * Query for all logs by tenant + type.
     */
    public createTenantAndTypePartitionKey(item: Pick<ILoggerLog, "tenant" | "type">): string {
        return `T#${item.tenant}#TYPE#${item.type}#LOG`;
    }

    public createTenantAndTypeSortKey(item: Pick<ILoggerLog, "id">): string {
        return item.id;
    }
}
