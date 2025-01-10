import { useEffect, useMemo, useState, type DependencyList } from "react";
import { createObjectHash } from "./useLoader/createObjectHash";
import { useRenderer } from "..";

export interface RendererLoader<TData = unknown, TError = unknown> {
    data: TData | null;
    loading: boolean;
    cacheHit: boolean;
    cacheKey: null | string;
    error: null | TError;
}

export interface UseLoaderOptions {
    cacheKey?: DependencyList;
}

export function useLoader<TData = unknown, TError = unknown>(
    loaderFn: () => Promise<TData>,
    options?: UseLoaderOptions
): RendererLoader<TData, TError> {
    const { getElement, loaderCache } = useRenderer();

    const element = getElement();

    const elementDataCacheKey = element.id;
    const optionsCacheKey = options?.cacheKey || [];
    const cacheKey = createObjectHash([elementDataCacheKey, ...optionsCacheKey]);

    const cachedData = useMemo(() => {
        return loaderCache.read<TData>(cacheKey);
    }, [cacheKey]);

    const [loader, setLoader] = useState<RendererLoader<TData, TError>>(
        cachedData
            ? {
                  data: cachedData,
                  loading: false,
                  cacheHit: true,
                  cacheKey,
                  error: null
              }
            : { data: null, loading: true, cacheHit: false, cacheKey: null, error: null }
    );

    useEffect(() => {
        if (cacheKey === loader.cacheKey) {
            return;
        }

        if (cachedData) {
            setLoader({ data: cachedData, loading: false, cacheKey, cacheHit: true, error: null });
            return;
        }

        setLoader({
            data: loader.data,
            error: loader.error,
            loading: true,
            cacheKey,
            cacheHit: false
        });
        loaderFn()
            .then(data => {
                loaderCache.write(cacheKey, data);
                setLoader({ data, error: null, loading: false, cacheKey, cacheHit: false });
            })
            .catch(error => {
                setLoader({ data: null, error, loading: false, cacheKey, cacheHit: false });
            });
    }, [cacheKey]);

    return loader;
}
