import styled from "@emotion/styled";
import { IconButton } from "@webiny/ui/Button";
import { DrawerRight } from "@webiny/ui/Drawer";

export const Drawer = styled(DrawerRight)`
    width: 1000px;
    max-width: 100vw;
    z-index: 25;

    & ~ .mdc-drawer-scrim {
        z-index: 24;
    }
`;

export const CloseButton = styled(IconButton)`
    position: absolute;
    top: 15px;
`;
