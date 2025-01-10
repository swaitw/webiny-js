import React from "react";
import { ElementBinding } from "./DataSourceProperties/ElementBinding";
import { DataSourceConfigInput } from "./DataSourceProperties/DataSourceConfigInput";

export const DataSourceConfigAndBindings = () => {
    return (
        <>
            {/* Element input bindings. */}
            <ElementBinding elementType={"heading"} inputName={"text"} label={"Text"} />
            <ElementBinding elementType={"paragraph"} inputName={"text"} label={"Text"} />
            <ElementBinding elementType={"button"} inputName={"buttonText"} label={"Label"} />
            <ElementBinding elementType={"button"} inputName={"actionHref"} label={"Link"} />
            <ElementBinding elementType={"image"} inputName={"imageSrc"} label={"Image URL"} />
            <ElementBinding
                elementType={"repeater"}
                inputName={"dataSource"}
                label={"Data Source"}
            />
            <ElementBinding elementType={"grid"} inputName={"dataSource"} label={"Data Source"} />

            {/* DataSource config inputs. */}
            <DataSourceConfigInput
                elementType={"entries-list"}
                configName={"modelId"}
                label={"Model ID"}
            />

            <DataSourceConfigInput
                elementType={"entries-list"}
                configName={"limit"}
                label={"Limit"}
                format={value => (value !== "" ? parseInt(value) : 10)}
            />
        </>
    );
};
