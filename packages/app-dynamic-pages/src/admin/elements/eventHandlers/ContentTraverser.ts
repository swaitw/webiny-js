import { PbEditorElement } from "@webiny/app-page-builder/types";

type ElementNode = Omit<PbEditorElement, "elements"> & {
    elements: ElementNode[];
};

interface ElementNodeVisitor {
    (node: ElementNode): void;
}

export class ContentTraverser {
    traverse(element: ElementNode, visitor: ElementNodeVisitor): void {
        visitor(element);
        for (const node of element.elements) {
            this.traverse(node, visitor);
        }
    }
}
