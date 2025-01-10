import React from "react";
import styled from "@emotion/styled";
import { createRenderer } from "~/createRenderer";
import { useRenderer } from "~/hooks/useRenderer";
import { LinkComponent as LinkComponentType } from "~/types";
import { DefaultLinkComponent } from "~/renderers/components";
import { ElementInput } from "~/inputs/ElementInput";

declare global {
    // eslint-disable-next-line
    namespace JSX {
        interface IntrinsicElements {
            // "object" HTML tags cannot be clicked, hence the need for "pb-image-object-wrapper" wrapper.
            "pb-image-object": any;
        }
    }
}

export interface ImageElementData {
    image?: {
        title: string;
        width: string;
        height: string;
        file?: {
            src: string;
        };
        htmlTag?: string;
    };
    link?: {
        newTab: boolean;
        href: string;
    };
}

const SUPPORTED_IMAGE_RESIZE_WIDTHS = [100, 300, 500, 750, 1000, 1500, 2500];

const PbImg = styled.img`
    max-width: 100%;
    width: ${props => props.width};
    height: ${props => props.height};
`;

const PbImgObject = styled.object`
    max-width: 100%;
    width: ${props => props.width};
    height: ${props => props.height};

    // "object" HTML tags cannot be clicked, hence the need for the wrapper
    // "pb-image-object-wrapper" tag, which handles click events. For this
    // to work, we need to set "pointer-events: none" on the object tag.
    pointer-events: none;
`;

const elementInputs = {
    imageSrc: ElementInput.create<string, ImageElementData>({
        name: "imageSrc",
        translatable: false,
        type: "link",
        getDefaultValue({ element }) {
            return element.data.image?.file?.src;
        }
    })
};

export interface ImageRendererProps {
    onClick?: () => void;
    renderEmpty?: React.ReactNode;
    value?: { id: string; src: string };
    link?: { href: string; newTab?: boolean };
    linkComponent?: LinkComponentType;
}

export const ImageRenderer = createRenderer<ImageRendererProps, typeof elementInputs>(
    props => {
        const { link, renderEmpty, onClick } = props;
        const LinkComponent = props.linkComponent || DefaultLinkComponent;
        const { getElement, getInputValues } = useRenderer();
        const element = getElement<ImageElementData>();
        const inputs = getInputValues<typeof elementInputs>();
        const imageSrc = inputs.imageSrc;

        let content;
        if (imageSrc) {
            const {
                title = "",
                width = "100%",
                height = "auto",
                htmlTag = "auto"
            } = element.data.image || {};

            const imageTag = htmlTag === "auto" && imageSrc.endsWith(".svg") ? "object" : "img";

            if (imageTag === "object") {
                content = (
                    <pb-image-object onClick={onClick}>
                        <PbImgObject
                            // Image has its width / height set from its own settings.
                            width={width}
                            height={height}
                            title={title}
                            data={imageSrc}
                        />
                    </pb-image-object>
                );
            } else {
                // If a fixed image width in pixels was set, let's filter out unneeded
                // image resize widths. For example, if 155px was set as the fixed image
                // width, then we want the `srcset` attribute to only contain 100w and 300w.
                let srcSetWidths: number[] = [];

                if (width && width.endsWith("px")) {
                    const imageWidthInt = parseInt(width);
                    for (let i = 0; i < SUPPORTED_IMAGE_RESIZE_WIDTHS.length; i++) {
                        const supportedResizeWidth = SUPPORTED_IMAGE_RESIZE_WIDTHS[i];
                        if (imageWidthInt > supportedResizeWidth) {
                            srcSetWidths.push(supportedResizeWidth);
                        } else {
                            srcSetWidths.push(supportedResizeWidth);
                            break;
                        }
                    }
                } else {
                    // If a fixed image width was not provided, we
                    // rely on all the supported image resize widths.
                    srcSetWidths = SUPPORTED_IMAGE_RESIZE_WIDTHS;
                }

                const srcSet = srcSetWidths
                    .map(item => {
                        return `${imageSrc}?width=${item} ${item}w`;
                    })
                    .join(", ");

                content = (
                    <PbImg
                        // Image has its width / height set from its own settings.
                        width={width}
                        height={height}
                        alt={title}
                        title={title}
                        src={imageSrc}
                        srcSet={srcSet}
                        onClick={onClick}
                    />
                );
            }
        } else {
            content = renderEmpty || null;
        }

        const linkProps = link || element.data?.link;
        if (linkProps) {
            const { href, newTab } = linkProps;
            if (href) {
                content = (
                    <LinkComponent href={href} target={newTab ? "_blank" : "_self"}>
                        {content}
                    </LinkComponent>
                );
            }
        }

        return <>{content}</>;
    },
    {
        inputs: elementInputs,
        baseStyles: { width: "100%" },
        propsAreEqual: (prevProps, nextProps) => {
            return prevProps.value === nextProps.value;
        }
    }
);
