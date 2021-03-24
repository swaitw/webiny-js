import React from "react";
import { AdminMenuPlugin } from "@webiny/app-admin/types";
import { ReactComponent as Icon } from "./assets/directions_car-24px.svg";

export default (): AdminMenuPlugin => ({
    type: "admin-menu",
    name: "admin-menu-carManufacturers",
    render({ Menu, Item }) {
        return (
            <Menu name="menu-carManufacturers" label={"CarManufacturers"} icon={<Icon />}>
                <Item label={"CarManufacturers"} path={"/carManufacturers/"} />
            </Menu>
        );
    }
});
