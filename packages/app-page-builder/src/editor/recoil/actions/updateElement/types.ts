import { PbEditorElement, PbEditorElementTree } from "~/types";

export interface UpdateElementActionArgsType {
    element: PbEditorElement | PbEditorElementTree;
    history: boolean;
    triggerUpdateElementTree?: boolean;
    debounce?: boolean;
    onFinish?: () => void;
}
