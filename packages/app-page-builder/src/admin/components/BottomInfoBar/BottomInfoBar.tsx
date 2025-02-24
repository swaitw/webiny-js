import React from "react";
import { ListMeta } from "./ListMeta";
import { BottomInfoBarInner, BottomInfoBarWrapper } from "./BottomInfoBar.styled";

interface BottomInfoBarProps {
    loading: boolean;
    totalCount: number;
    currentCount: number;
}

export const BottomInfoBar = (props: BottomInfoBarProps) => {
    return (
        <BottomInfoBarWrapper>
            <BottomInfoBarInner>
                <ListMeta
                    loading={props.loading}
                    totalCount={props.totalCount}
                    currentCount={props.currentCount}
                />
            </BottomInfoBarInner>
        </BottomInfoBarWrapper>
    );
};
