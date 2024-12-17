import { RenderResult } from "~/render/types";

function getFontType(url: string) {
    if (url.endsWith(".woff2")) {
        return "woff2";
    }
    if (url.endsWith(".woff")) {
        return "woff";
    }
    if (url.endsWith(".ttf")) {
        return "truetype";
    }
    if (url.endsWith(".otf")) {
        return "opentype";
    }
    if (url.endsWith(".eot")) {
        return "embedded-opentype";
    }
    return "font";
}

export const preloadFonts = (render: RenderResult): void => {
    const fontsRequests = render.meta.interceptedRequests.filter(
        req => req.type === "font" && req.url
    );

    const preloadLinks: string = Array.from(fontsRequests)
        .map(req => {
            return `<link rel="preload" href="${req.url}" as="font" type="font/${getFontType(
                req.url
            )}" crossorigin="anonymous">`;
        })
        .join("\n");

    // Inject the preload tags into the <head> section
    render.content = render.content.replace("</head>", `${preloadLinks}</head>`);
};
