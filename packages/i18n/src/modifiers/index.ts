// Built-in modifiers
import countModifiers from "./countModifier";
import genderModifier from "./genderModifier";
import ifModifier from "./ifModifier";
import pluralModifier from "./pluralModifier";
import dateModifier from "./dateModifier";
import dateTimeModifier from "./dateTimeModifier";
import timeModifier from "./timeModifier";
import numberModifier from "./numberModifier";
import priceModifier from "./priceModifier";
import { Modifier, ModifierOptions } from "~/types";

export default (options: ModifierOptions): Modifier[] => [
    countModifiers(),
    genderModifier(),
    ifModifier(),
    pluralModifier(),
    dateModifier(options),
    dateTimeModifier(options),
    timeModifier(options),
    numberModifier(options),
    priceModifier(options)
];
