import React from "react";
import { IconPickerConfig } from ".";

type FaIconSet = {
    [key: string]: {
        body: string;
        width?: number;
    };
};

type FaCategorySet = {
    [key: string]: string[];
};

export const FontAwesomeIcons = () => {
    return (
        <IconPickerConfig>
            {/* Default Icons Providers */}
            <IconPickerConfig.IconPack
                name="fa6_brands"
                provider={async () => {
                    const fa6Brands = await import(
                        /* webpackChunkName: "iconpicker-fa6-brands" */
                        "@iconify/json/json/fa6-brands.json"
                    );

                    const icons: FaIconSet = fa6Brands.icons;
                    const categories: FaCategorySet = fa6Brands.categories;

                    return Object.keys(icons).map(key => {
                        const icon = icons[key];
                        return {
                            type: "icon",
                            name: `fa6_brands_${key}`,
                            value: icon.body,
                            category: Object.keys(categories).find(categoryKey =>
                                categories[categoryKey].includes(key)
                            ),
                            width: icon.width
                        };
                    });
                }}
            />
            <IconPickerConfig.IconPack
                name="fa6_regular"
                provider={async () => {
                    const fa6Regular = await import(
                        /* webpackChunkName: "iconpicker-fa6-regular" */
                        "@iconify/json/json/fa6-regular.json"
                    );

                    const icons: FaIconSet = fa6Regular.icons;
                    const categories: FaCategorySet = fa6Regular.categories;

                    return Object.keys(icons).map(key => {
                        const icon = icons[key];
                        return {
                            type: "icon",
                            name: `fa6_regular_${key}`,
                            value: icon.body,
                            category: Object.keys(categories).find(categoryKey =>
                                categories[categoryKey].includes(key)
                            ),
                            width: icon.width
                        };
                    });
                }}
            />
            <IconPickerConfig.IconPack
                name="fa6_solid"
                provider={async () => {
                    const fa6Solid = await import(
                        /* webpackChunkName: "iconpicker-fa6-solid" */
                        "@iconify/json/json/fa6-solid.json"
                    );

                    const icons: FaIconSet = fa6Solid.icons;
                    const categories: FaCategorySet = fa6Solid.categories;

                    return Object.keys(icons).map(key => {
                        const icon = icons[key];
                        return {
                            type: "icon",
                            name: `fa6_solid_${key}`,
                            value: icon.body,
                            category: Object.keys(categories).find(categoryKey =>
                                categories[categoryKey].includes(key)
                            ),
                            width: icon.width
                        };
                    });
                }}
            />
        </IconPickerConfig>
    );
};
