import { atom } from "recoil";
import { PbPageTemplate } from "~/types";

export const templateAtom = atom<PbPageTemplate>({
    key: "templateAtom"
});
