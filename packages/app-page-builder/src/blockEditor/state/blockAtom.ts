import { atom } from "recoil";
import { PbEditorElementTree } from "~/types";

export interface BlockWithContent extends BlockAtomType {
    content: PbEditorElementTree;
}

export interface BlockAtomType {
    id: string;
    name: string;
    blockCategory: string;
    savedOn?: Date;
    createdBy: {
        id: string | null;
    };
}

export const blockAtom = atom<BlockAtomType>({
    key: "blockAtom",
    default: {
        id: "",
        name: "",
        blockCategory: "",
        createdBy: {
            id: null
        }
    }
});
