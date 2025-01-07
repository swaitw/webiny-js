import { useEffect } from "react";
import { useEventActionHandler } from "@webiny/app-page-builder/editor";
import {
    CreateElementActionEvent,
    DeleteElementActionEvent
} from "@webiny/app-page-builder/editor/recoil/actions";
import type {
    DynamicDocument,
    EventActionCallable,
    PbEditorElementTree,
    PbPageTemplate
} from "@webiny/app-page-builder/types";
import type { CreateElementEventActionArgsType } from "@webiny/app-page-builder/editor/recoil/actions/createElement/types";
import type { DeleteElementActionArgsType } from "@webiny/app-page-builder/editor/recoil/actions/deleteElement/types";
import { ContentTraverser } from "@webiny/app-page-builder/dataInjection";

const doNothing = {
    actions: []
};

const addCmsListDataSource = <T extends DynamicDocument>(
    document: T,
    element: PbEditorElementTree
): T => {
    const dataSourceName = `element:${element.id}`;

    const gridElement = element.elements[0];

    return {
        ...document,
        dataSources: [
            ...document.dataSources,
            {
                name: dataSourceName,
                type: "cms.entries",
                config: {
                    modelId: undefined,
                    limit: 10
                }
            }
        ],
        dataBindings: [
            ...document.dataBindings,
            {
                dataSource: dataSourceName,
                bindFrom: "*",
                bindTo: `element:${gridElement.id}.dataSource`
            }
        ]
    };
};

export const ElementEventHandlers = () => {
    const eventHandler = useEventActionHandler();

    const onElementCreate: EventActionCallable<CreateElementEventActionArgsType> = (
        state,
        _,
        args
    ) => {
        if (!args) {
            return doNothing;
        }

        const { element } = args;

        if (element.type !== "entries-list") {
            return doNothing;
        }

        // @ts-expect-error Event callable types need to be more generic.
        const template = state.template as PbPageTemplate;

        const updatedTemplate = addCmsListDataSource(template, element as PbEditorElementTree);

        return {
            state: {
                ...state,
                template: updatedTemplate
            },
            actions: []
        };
    };

    const onElementDelete: EventActionCallable<DeleteElementActionArgsType> = async (
        state,
        _,
        args
    ) => {
        if (!args) {
            return doNothing;
        }

        const { element } = args;

        // @ts-expect-error Event callable types need to be more generic.
        const template = state.template as PbPageTemplate;

        const withDescendants = await state.getElementTree({ element });

        const traverser = new ContentTraverser();
        const deletedElements: string[] = [element.id];

        traverser.traverse(withDescendants, node => {
            deletedElements.push(node.id);
        });

        const deleteDataSources = deletedElements.map(id => `element:${id}`);
        const deleteDataBindings = deletedElements.map(id => `element:${id}.`);

        const updatedTemplate: PbPageTemplate = {
            ...template,
            dataSources: template.dataSources.filter(ds => {
                return !deleteDataSources.includes(ds.name);
            }),
            dataBindings: template.dataBindings.filter(binding => {
                return !deleteDataBindings.some(toDelete => binding.bindTo.startsWith(toDelete));
            })
        };

        return {
            state: {
                ...state,
                template: updatedTemplate
            },
            actions: []
        };
    };

    useEffect(() => {
        const offCreateElement = eventHandler.on(CreateElementActionEvent, onElementCreate);
        const offDeleteElement = eventHandler.on(DeleteElementActionEvent, onElementDelete);

        return () => {
            offCreateElement();
            offDeleteElement();
        };
    }, []);
    return null;
};
