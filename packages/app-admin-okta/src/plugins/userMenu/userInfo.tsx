import React from "react";
import { css } from "emotion";
import { useSecurity } from "@webiny/app-security/hooks/useSecurity";
import { ListItem, ListItemGraphic } from "@webiny/ui/List";
import { Typography } from "@webiny/ui/Typography";
import { Avatar } from "@webiny/ui/Avatar";
import { GenericElement } from "@webiny/app-admin/ui/elements/GenericElement";
import { UIViewPlugin } from "@webiny/app-admin/ui/UIView";
import { AdminView } from "@webiny/app-admin/ui/views/AdminView";

const avatarImage = css({
    height: "40px !important",
    width: "40px !important",
    borderRadius: "50%",
    display: "inline-block",
    ">div": {
        backgroundColor: "var(--mdc-theme-surface)"
    }
});

const linkStyles = css({
    backgroundColor: "var(--mdc-theme-background)",
    marginTop: -25,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
    textDecoration: "none",
    display: "block",
    ">.mdc-list-item": {
        display: "flex",
        height: "65px !important",
        marginTop: 15,
        ".avatar": {
            marginTop: 10
        }
    },
    "h3, h3>.mdc-typography--headline6": {
        lineHeight: "1em !important"
    },
    ".mdc-menu &.mdc-list-item": {
        ">.mdc-list-item__text": {
            fontWeight: "bold"
        }
    },
    ".mdc-list-item": {
        height: "auto",
        ".mdc-typography--headline6": {
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            maxWidth: 180,
            display: "block"
        },
        ".mdc-typography--subtitle2": {
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            maxWidth: 180
        }
    }
});

const UserInfo = () => {
    const security = useSecurity();

    if (!security || !security.identity) {
        return null;
    }

    const { id, displayName } = security.identity;

    return (
        <div className={linkStyles}>
            <ListItem ripple={false} className={linkStyles}>
                <ListItemGraphic className={avatarImage}>
                    <Avatar
                        className={"avatar"}
                        src={null}
                        alt={displayName}
                        fallbackText={displayName}
                    />
                </ListItemGraphic>
                <div>
                    <h3>
                        <Typography use={"headline6"}>{displayName}</Typography>
                    </h3>
                    <Typography use={"subtitle2"}>{id}</Typography>
                </div>
            </ListItem>
        </div>
    );
};

export default () => {
    return new UIViewPlugin<AdminView>(AdminView, view => {
        const userMenu = view.getElement("userMenu");
        if (!userMenu) {
            return;
        }

        const userInfo = new GenericElement("userInfo", () => <UserInfo />);
        userInfo.moveToTheBeginningOf(userMenu);
        view.refresh();
    });
};
