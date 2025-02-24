import { MoveElementActionEvent } from "./event";
import { moveElementAction } from "./action";
import { PbEditorEventActionPlugin } from "~/types";

export default (): PbEditorEventActionPlugin => {
    return {
        type: "pb-editor-event-action-plugin",
        name: "pb-editor-event-action-move-element",
        onEditorMount: handler => {
            return handler.on(MoveElementActionEvent, moveElementAction);
        }
    };
};
