/**
 * Storage transforms are used to transform the data before it is saved to the database and after it is read from the database.
 */
import { createDefaultStorageTransform } from "./default";
import { createObjectStorageTransform } from "./object";
import { createJsonStorageTransform } from "./json";
import { createDynamicZoneStorageTransform } from "./dynamicZone";
import { createDateStorageTransformPlugin } from "./date";

export const createStorageTransform = () => {
    return [
        createDefaultStorageTransform(),
        createDateStorageTransformPlugin(),
        createObjectStorageTransform(),
        createJsonStorageTransform(),
        createDynamicZoneStorageTransform()
    ];
};
