import type { ILoaderCache } from "@webiny/app-page-builder-elements/hooks/useLoader/ILoaderCache";
import { getPrerenderId, isPrerendering } from "@webiny/app/utils";
import { PeLoaderHtmlCache } from "~/utils/WebsiteLoaderCache/PeLoaderHtmlCache";

export class WebsiteLoaderCache implements ILoaderCache {
    private loaderCache: Record<string, any> = {};

    read<TData = unknown>(key: string) {
        if (key in this.loaderCache) {
            return this.loaderCache[key];
        }

        if (getPrerenderId()) {
            this.loaderCache[key] = PeLoaderHtmlCache.read<TData>(key);
            return this.loaderCache[key];
        }

        this.loaderCache[key] = null;
        return this.loaderCache[key];
    }

    write<TData = unknown>(key: string, value: TData) {
        this.loaderCache[key] = value;

        if (isPrerendering()) {
            PeLoaderHtmlCache.write(key, value);
        }
    }

    remove(key: string) {
        delete this.loaderCache[key];
    }

    clear() {
        this.loaderCache = {};
    }
}
