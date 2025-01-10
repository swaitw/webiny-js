import { createRichTextStorageTransformPlugin } from "./storage/richText";
import { createLongTextStorageTransformPlugin } from "./storage/longText";

export default () => createDynamoDbPlugins();

export const createDynamoDbPlugins = () => {
    return [createRichTextStorageTransformPlugin(), createLongTextStorageTransformPlugin()];
};
