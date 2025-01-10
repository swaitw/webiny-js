import { PostModifyElementArgs } from "../../elementSettings/useUpdateHandlers";

export const replaceFullIconObject = ({ newElement, newValue }: PostModifyElementArgs): void => {
    // If the icon value has changed, replace `icon.value` with `newValue.value`,
    // instead of performing the default merge of objects.
    const iconData = newElement.data.icon;

    if (iconData && newValue) {
        iconData.icon = newValue.icon;
        // Remove v1 properties
        // @ts-ignore This property existed in v1 of the icon settings.
        delete iconData["id"];
        // @ts-ignore This property existed in v1 of the icon settings.
        delete iconData["color"];
        // @ts-ignore This property existed in v1 of the icon settings.
        delete iconData["svg"];
    }
};
