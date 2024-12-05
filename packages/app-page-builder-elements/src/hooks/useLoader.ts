import { useEffect, useMemo, useState, type DependencyList } from "react";
import { createObjectHash } from "./useLoader/createObjectHash";
import { useRenderer } from "..";

export interface RendererLoader<TData = unknown> {
    data: TData | null;
    loading: boolean;
    cacheHit: boolean;
    cacheKey: null | string;
}

export interface UseLoaderOptions {
    cacheKey?: DependencyList;
}

export function useLoader<TData = unknown>(
    loaderFn: () => Promise<TData>,
    options?: UseLoaderOptions
): RendererLoader<TData> {
    const { getElement, loaderCache } = useRenderer();

    const element = getElement();

    const elementDataCacheKey = element.id;
    const optionsCacheKey = options?.cacheKey || [];
    const cacheKey = createObjectHash([elementDataCacheKey, ...optionsCacheKey]);

    const cachedData = useMemo(() => {
        return loaderCache.read<TData>(cacheKey);
    }, [cacheKey]);

    const [loader, setLoader] = useState<RendererLoader<TData>>(
        cachedData
            ? {
                  data: cachedData,
                  loading: false,
                  cacheHit: true,
                  cacheKey
              }
            : { data: null, loading: true, cacheHit: false, cacheKey: null }
    );

    useEffect(() => {
        if (cacheKey === loader.cacheKey) {
            return;
        }

        if (cachedData) {
            setLoader({ data: cachedData, loading: false, cacheKey, cacheHit: true });
            return;
        }

        setLoader({ data: loader.data, loading: true, cacheKey, cacheHit: false });
        loaderFn().then(data => {
            loaderCache.write(cacheKey, data);
            setLoader({ data, loading: false, cacheKey, cacheHit: false });
        });
    }, [cacheKey]);

    return loader;
}
