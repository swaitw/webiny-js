import React from "react";
import { Image } from "@webiny/ui/Image";
import { ImageComponentPlugin } from "~/types";

const SUPPORTED_IMAGE_RESIZE_WIDTHS = [100, 300, 500, 750, 1000, 1500, 2500];

/**
 * Width of the image should not be just any random number. For optimization reasons,
 * we only allow the ones listed in SUPPORTED_IMAGE_RESIZE_WIDTHS list (Webiny Cloud supports only these).
 */
const getSupportedImageResizeWidth = (width: number) => {
    let output = SUPPORTED_IMAGE_RESIZE_WIDTHS[0];
    let i = SUPPORTED_IMAGE_RESIZE_WIDTHS.length;
    while (i >= 0) {
        if (width === SUPPORTED_IMAGE_RESIZE_WIDTHS[i]) {
            output = SUPPORTED_IMAGE_RESIZE_WIDTHS[i];
            break;
        }

        if (width > SUPPORTED_IMAGE_RESIZE_WIDTHS[i]) {
            // Use next larger width. If there isn't any, use current.
            output = SUPPORTED_IMAGE_RESIZE_WIDTHS[i + 1];
            if (!output) {
                output = SUPPORTED_IMAGE_RESIZE_WIDTHS[i];
            }
            break;
        }

        i--;
    }

    return output;
};

interface SanitizeTransformArgsParams {
    width?: string;
}
interface SanitizeTransformArgsResult {
    width?: number;
}
/**
 * Currently we only allow "width" as a transform option.
 * @param args
 */
const sanitizeTransformArgs = (args?: SanitizeTransformArgsParams): SanitizeTransformArgsResult => {
    const output: SanitizeTransformArgsResult = {};
    if (!args || args.width === undefined || args.width === null) {
        return output;
    }
    const width = parseInt(args.width);
    if (width > 0) {
        output.width = getSupportedImageResizeWidth(width);
    }

    return output;
};

const getSizes = (width?: string | number): string | undefined => {
    if (typeof width !== "string") {
        return undefined;
    }
    // Check if width was set as percentage, with "%" in the value.
    if (width.endsWith("%")) {
        return `${parseInt(width)}vw`;
    }
    // Check if width was set as viewport width, with "vw" in the value.
    if (width.endsWith("vw")) {
        return `${parseInt(width)}vw`;
    }

    // Check if width was set as relative, with "em" in the value.
    if (width.endsWith("em")) {
        return `${parseInt(width)}em`;
    }

    return undefined;
};

const isFixedImageWidth = (width?: number | string) => {
    if (Number.isFinite(width)) {
        return true;
    }

    if (typeof width === "string" && width.endsWith("px")) {
        return true;
    }
    return false;
};

const getSrcSetAutoSizes = (max?: string | number) => {
    max = isFixedImageWidth(max) ? parseInt("" + max) : 2500;
    const maxWidth = getSupportedImageResizeWidth(max);
    return SUPPORTED_IMAGE_RESIZE_WIDTHS.filter((supportedWidth: number) => {
        return supportedWidth <= maxWidth;
    });
};

const convertTransformToQueryParams = (transform: Record<string, any>): string => {
    return Object.keys(transform)
        .map(key => `${key}=${transform[key]}`)
        .join("&");
};

export default () => {
    const imagePlugin: ImageComponentPlugin = {
        name: "image-component",
        type: "image-component",
        presets: {
            avatar: { width: 300 }
        },
        getImageSrc: (props?: Record<string, any>) => {
            if (!props) {
                return "";
            }

            const { src, transform } = props;
            if (!transform) {
                return src;
            }

            if (!src || src.startsWith("data:") || src.endsWith("svg")) {
                return src;
            }

            const sanitizedParams = sanitizeTransformArgs(transform);
            const params = convertTransformToQueryParams(sanitizedParams);
            return src + "?" + params;
        },
        render(props) {
            const { transform, srcSet: srcSetInitial, ...imageProps } = props;
            let srcSet: any = srcSetInitial;
            let sizes: string | undefined;
            const src = imageProps.src;
            if (srcSet && srcSet === "auto") {
                srcSet = {};

                // Check if image width was forced, and additionally if width was set as pixels, with "px" in the value.
                const forcedWidth = props.width || (props.style && props.style.width);
                const srcSetAutoWidths = getSrcSetAutoSizes(forcedWidth);
                srcSetAutoWidths.forEach(width => {
                    srcSet[width + "w"] = imagePlugin.getImageSrc({
                        src,
                        transform: { ...transform, width }
                    });
                });
                sizes = getSizes(forcedWidth);
            }

            return <Image {...imageProps} srcSet={srcSet} src={src} sizes={sizes} />;
        }
    };

    return imagePlugin;
};
