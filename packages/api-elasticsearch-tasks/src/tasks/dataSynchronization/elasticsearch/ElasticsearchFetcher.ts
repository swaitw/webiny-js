import { Client } from "@webiny/api-elasticsearch";
import {
    IElasticsearchFetcher,
    IElasticsearchFetcherFetchParams,
    IElasticsearchFetcherFetchResponse,
    IElasticsearchFetcherFetchResponseItem
} from "./abstractions/ElasticsearchFetcher";
import { ElasticsearchSearchResponse, PrimitiveValue } from "@webiny/api-elasticsearch/types";
import { shouldIgnoreEsResponseError } from "./shouldIgnoreEsResponseError";
import { inspect } from "node:util";

export interface IElasticsearchFetcherParams {
    client: Client;
}

export class ElasticsearchFetcher implements IElasticsearchFetcher {
    private readonly client: Client;

    public constructor(params: IElasticsearchFetcherParams) {
        this.client = params.client;
    }
    public async fetch({
        index,
        cursor,
        limit
    }: IElasticsearchFetcherFetchParams): Promise<IElasticsearchFetcherFetchResponse> {
        let response: ElasticsearchSearchResponse<undefined>;
        try {
            response = await this.client.search({
                index,
                body: {
                    query: {
                        match_all: {}
                    },
                    sort: {
                        "id.keyword": {
                            order: "asc"
                        }
                    },
                    size: limit + 1,
                    track_total_hits: true,
                    search_after: cursor,
                    _source: false
                }
            });
        } catch (ex) {
            /**
             * If we ignore the error, we can continue with the next index.
             */
            if (shouldIgnoreEsResponseError(ex)) {
                if (process.env.DEBUG === "true") {
                    console.error(
                        inspect(ex, {
                            depth: 5,
                            showHidden: true
                        })
                    );
                }
                return {
                    done: true,
                    totalCount: 0,
                    items: []
                };
            }
            console.error("Failed to fetch data from Elasticsearch.", ex);
            throw ex;
        }

        const { hits, total } = response.body.hits;
        if (hits.length === 0) {
            return {
                done: true,
                cursor: undefined,
                totalCount: total.value,
                items: []
            };
        }

        const hasMoreItems = hits.length > limit;
        let nextCursor: PrimitiveValue[] | undefined;
        if (hasMoreItems) {
            hits.pop();
            nextCursor = hits.at(-1)?.sort;
        }
        const items = hits.reduce<IElasticsearchFetcherFetchResponseItem[]>((collection, hit) => {
            const [PK, SK] = hit._id.split(":");
            if (!PK || !SK) {
                return collection;
            }
            collection.push({
                PK,
                SK,
                _id: hit._id,
                index: hit._index
            });

            return collection;
        }, []);

        return {
            totalCount: total.value,
            cursor: nextCursor,
            done: !nextCursor,
            items
        };
    }
}
