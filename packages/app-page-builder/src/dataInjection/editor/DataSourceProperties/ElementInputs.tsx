import React from "react";
import { ElementBinding } from "./ElementBinding";

export const ElementInputs = () => {
    return (
        <>
            <ElementBinding elementType={"heading"} inputName={"text"} label={"Text"} />
            <ElementBinding elementType={"paragraph"} inputName={"text"} label={"Text"} />
            <ElementBinding elementType={"button"} inputName={"buttonText"} label={"Label"} />
            <ElementBinding elementType={"button"} inputName={"actionHref"} label={"Link"} />
            <ElementBinding
                elementType={"repeater"}
                inputName={"dataSource"}
                label={"Data Source"}
            />
            <ElementBinding elementType={"grid"} inputName={"dataSource"} label={"Data Source"} />
        </>
    );
};
