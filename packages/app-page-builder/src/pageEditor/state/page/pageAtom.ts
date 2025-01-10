import { atom } from "recoil";
import { DynamicDocument, PbEditorElementTree } from "~/types";

interface PageCategoryType {
    slug: string;
    name: string;
    url: string;
}

export interface PageWithContent extends PageAtomType {
    content: PbEditorElementTree;
}

export interface PageAtomType extends DynamicDocument {
    id: string;
    title?: string;
    pid?: string;
    path: string;
    status: string;
    settings: {
        general: {
            layout: string;
            tags: string[];
        };
    };
    parent?: string;
    version: number;
    locked: boolean;
    published: boolean;
    savedOn?: string;
    snippet: string | null;
    category?: PageCategoryType;
    createdBy: {
        id: string | null;
    };
}

export const pageAtom = atom<PageAtomType>({
    key: "pageAtom",
    default: {
        id: "",
        locked: false,
        version: 1,
        published: false,
        snippet: null,
        dataSources: [],
        dataBindings: [],
        createdBy: {
            id: null
        },
        settings: {
            general: {
                layout: "static",
                tags: []
            }
        },
        path: "",
        status: ""
    }
});
