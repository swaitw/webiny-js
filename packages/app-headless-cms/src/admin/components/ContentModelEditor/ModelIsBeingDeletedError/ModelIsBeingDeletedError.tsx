import * as React from "react";
import Helmet from "react-helmet";
import { css } from "emotion";
import styled from "@emotion/styled";
import { Typography } from "@webiny/ui/Typography";
import authErrorImg from "./SecureRouteError.svg";
import type { CmsModel } from "@webiny/app-headless-cms-common/types";
import { useRouter } from "@webiny/react-router";

const ContentWrapper = styled("div")({
    display: "block",
    paddingTop: "15%",
    textAlign: "center",
    margin: "auto"
});

const styles = {
    authErrorImgStyle: css({
        width: "192px",
        paddingBottom: "24px"
    }),
    bodyStyle: css({
        color: "var(--mdc-theme-text-primary-on-background)",
        display: "block",
        " strong": {
            fontWeight: "bold"
        }
    }),
    linkStyle: css({
        cursor: "pointer",
        textDecoration: "none",
        "&:hover": {
            textDecoration: "underline"
        }
    })
};

export interface ImageProps {
    className?: string;
    alt?: string;
}

const Image = ({ className = styles.authErrorImgStyle, alt = "Not Authorized" }: ImageProps) => {
    return <img className={className} src={authErrorImg} alt={alt} />;
};

export interface IModelIsBeingDeletedProps {
    model: Pick<CmsModel, "name">;
}

export const ModelIsBeingDeletedError = (props: IModelIsBeingDeletedProps) => {
    const { history } = useRouter();

    const goBack = (): void => {
        history.push(`/cms/content-models`);
    };

    return (
        <ContentWrapper>
            <Helmet title={"Cannot access the model!"} />
            <Image />

            <Typography use={"body1"} className={styles.bodyStyle}>
                Model <strong>{props.model.name}</strong> is being deleted and cannot be accessed or
                changed.
            </Typography>

            <p>
                <br />
            </p>

            <a onClick={goBack} className={styles.linkStyle}>
                Go back
            </a>
        </ContentWrapper>
    );
};
