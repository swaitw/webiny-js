import React from "react";
import type { CmsModel } from "~/types";
import { css } from "emotion";

export interface IInformationProps {
    model: Pick<CmsModel, "plugin">;
}

const warningClassName = css({
    color: "var(--mdc-theme-error)"
});

export const Information = (props: IInformationProps) => {
    const { model } = props;
    return (
        <>
            {model.plugin ? (
                <>
                    <p>
                        This model is a plugin one, and it cannot be deleted. Only its entries can
                        be deleted.
                    </p>
                    <p>
                        <br />
                    </p>
                    <p>- This action will permanently delete all model entries.</p>
                </>
            ) : (
                <p>- This action will permanently delete the model and all its entries.</p>
            )}
            <p>- References to this model in other parts of the system will be emptied.</p>
            <p>- All relevant lifecycle events will be triggered.</p>
            <p className={warningClassName}> - This action cannot be undone!</p>
        </>
    );
};
