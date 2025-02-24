import React, { ComponentProps } from "react";
import { Link } from "@webiny/react-router";
import { ImageRenderer } from "@webiny/app-page-builder-elements/renderers/image";

const LinkComponent: ComponentProps<typeof ImageRenderer>["linkComponent"] = ({
    href,
    children,
    ...rest
}) => {
    return (
        // While testing, we noticed that the `href` prop is sometimes `null` or `undefined`.
        // Hence, the `href || ""` part. This fixes the issue.
        <Link to={href || ""} {...rest}>
            {children}
        </Link>
    );
};

LinkComponent.displayName = "ImageLink";

export const AddImageLinkComponent = ImageRenderer.createDecorator(Original => {
    return function ImageWithLink(props) {
        return <Original {...props} linkComponent={props.linkComponent ?? LinkComponent} />;
    };
});
