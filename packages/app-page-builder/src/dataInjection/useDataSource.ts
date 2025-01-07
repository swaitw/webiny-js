import { useContext } from "react";
import { DataSourceContext } from "./DataSourceProvider";

export const useDataSource = () => {
    const context = useContext(DataSourceContext);

    if (!context) {
        console.info(
            `Missing DataSourceProvider in the component hierarchy! [TODO: Fix the "saveElement" action dialog!]`
        );
    }

    return context;
};
