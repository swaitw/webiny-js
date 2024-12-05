import { PeLoaderCacheEntry } from "./types";
import he from "he";

const parsePeLoaderDataCacheTag = (content: string): PeLoaderCacheEntry | null => {
    const regex =
        /<pe-loader-data-cache data-key="([a-zA-Z0-9-#]+)" data-value="(.*)"><\/pe-loader-data-cache>/gm;
    let m;

    while ((m = regex.exec(content)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        const [, key, value] = m;

        // JSON in `data-value` is HTML Entities-encoded. So, we need to decode it here first.
        const heParsedValue = he.decode(value);
        const parsedValue = JSON.parse(heParsedValue);
        return { key, value: parsedValue };
    }

    return null;
};

export default (content: string): PeLoaderCacheEntry[] => {
    if (!content) {
        return [];
    }

    const cachedData: PeLoaderCacheEntry[] = [];
    const regex = /<pe-loader-data-cache .*><\/pe-loader-data-cache>/gm;
    let m;

    while ((m = regex.exec(content)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        const [matchedTag] = m;

        if (!matchedTag) {
            continue;
        }

        const parsedTag = parsePeLoaderDataCacheTag(matchedTag);
        if (!parsedTag) {
            continue;
        }

        cachedData.push(parsedTag);
    }

    if (cachedData.length > 0) {
        const uniqueMap: Record<string, PeLoaderCacheEntry> = cachedData.reduce(
            (collection, peLoaderDataCache) => {
                collection[`${peLoaderDataCache.key || ""}${peLoaderDataCache.value || ""}`] =
                    peLoaderDataCache;

                return collection;
            },
            {} as Record<string, PeLoaderCacheEntry>
        );

        return Object.values(uniqueMap);
    }
    return cachedData;
};
