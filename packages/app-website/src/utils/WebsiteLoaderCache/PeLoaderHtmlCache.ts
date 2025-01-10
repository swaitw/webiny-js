import lzString from "lz-string";

const COMPRESSED_DATA_PREFIX = "pe_";

export class PeLoaderHtmlCache {
    static read<TData = unknown>(key: string) {
        const htmlElement = document.querySelector(`pe-loader-data-cache[data-key="${key}"]`);
        if (!htmlElement) {
            return null;
        }

        const cachedResultElementValue = htmlElement.getAttribute("data-value");
        if (!cachedResultElementValue) {
            return null;
        }

        try {
            return PeLoaderHtmlCache.decompressData(cachedResultElementValue) as TData;
        } catch {
            return null;
        }
    }

    static write<TData = unknown>(key: string, value: TData) {
        const html = `<pe-loader-data-cache data-key="${key}" data-value='${PeLoaderHtmlCache.compressData<TData>(
            value
        )}'></pe-loader-data-cache>`;
        document.body.insertAdjacentHTML("beforeend", html);
    }

    static compressData<TData>(data: TData) {
        return COMPRESSED_DATA_PREFIX + lzString.compressToBase64(JSON.stringify(data));
    }

    static decompressData(data: string) {
        return JSON.parse(
            lzString.decompressFromBase64(data.replace(COMPRESSED_DATA_PREFIX, "")) as string
        );
    }

    static isCompressedData<TData>(data: TData) {
        return typeof data === "string" && data.startsWith(COMPRESSED_DATA_PREFIX);
    }
}
