import React from "react";
import { ReactComponent as CloseIcon } from "@material-design-icons/svg/outlined/close.svg";
import { SimpleFormHeader } from "@webiny/app-admin/components/SimpleForm";
import { CloseButton } from "./RevisionListDrawer.styled";

interface HeaderProps {
    onClose: () => void;
}

export const Header = ({ onClose }: HeaderProps) => {
    return (
        <SimpleFormHeader title={"Entry revisions"}>
            <CloseButton icon={<CloseIcon />} onClick={onClose} />
        </SimpleFormHeader>
    );
};
