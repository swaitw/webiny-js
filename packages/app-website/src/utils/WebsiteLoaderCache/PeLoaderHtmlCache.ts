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
            return JSON.parse(cachedResultElementValue) as TData;
        } catch {
            return null;
        }
    }

    static write<TData = unknown>(key: string, value: TData) {
        const html = `<pe-loader-data-cache data-key="${key}" data-value='${JSON.stringify(
            value
        )}'></pe-loader-data-cache>`;
        document.body.insertAdjacentHTML("beforeend", html);
    }
}
