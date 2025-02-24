import React from "react";
import { IconPickerConfig } from ".";

type EmojiSet = {
    [key: string]: {
        name: string;
        slug: string;
        group: string;
        emoji_version: string;
        unicode_version: string;
        skin_tone_support: boolean;
    };
};

export const Emojis = () => {
    return (
        <IconPickerConfig>
            <IconPickerConfig.IconPack
                name="default_emojis"
                provider={async () => {
                    const emojisJson = await import(
                        /* webpackChunkName: "iconpicker-emojis" */
                        "unicode-emoji-json/data-by-emoji.json"
                    );

                    const emojis: EmojiSet = emojisJson.default;

                    return Object.keys(emojis).map(key => {
                        const emoji = emojis[key];
                        return {
                            type: "emoji",
                            name: emoji.slug,
                            value: key,
                            category: emoji.group,
                            skinToneSupport: emoji.skin_tone_support
                        };
                    });
                }}
            />
        </IconPickerConfig>
    );
};
