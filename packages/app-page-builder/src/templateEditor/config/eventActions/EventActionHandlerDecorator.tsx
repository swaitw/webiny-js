import React, { useEffect, useMemo, useRef } from "react";
import { createDecorator, DecoratableComponent, GenericComponent } from "@webiny/app-admin";
import {
    EventActionHandlerProvider,
    EventActionHandlerProviderProps,
    GetCallableState
} from "~/editor/contexts/EventActionHandlerProvider";
import { TemplateEditorEventActionCallableState } from "~/templateEditor/types";
import { useTemplate } from "~/templateEditor/hooks/useTemplate";
import { PbPageTemplate, PbEditorElementTree } from "~/types";

type ProviderProps = EventActionHandlerProviderProps<TemplateEditorEventActionCallableState>;

export const EventActionHandlerDecorator = createDecorator(
    EventActionHandlerProvider as unknown as DecoratableComponent<GenericComponent<ProviderProps>>,
    Component => {
        return function PbEventActionHandlerProvider(props) {
            const templateAtomValueRef = useRef<PbPageTemplate>();
            const [templateAtomValue, setTemplateAtomValue] = useTemplate();

            useEffect(() => {
                templateAtomValueRef.current = templateAtomValue;
            }, [templateAtomValue]);

            const getElementTree: ProviderProps["getElementTree"] = useMemo(
                () => [
                    ...(props.getElementTree || []),
                    next => {
                        return async props => {
                            const element = props?.element;
                            const res = await next({ element });

                            const cleanUpReferenceBlocks = (
                                element: PbEditorElementTree
                            ): PbEditorElementTree => {
                                if (element.data.blockId) {
                                    return {
                                        ...element,
                                        elements: []
                                    };
                                } else {
                                    return {
                                        ...element,
                                        elements: element.elements.map(child =>
                                            cleanUpReferenceBlocks(child)
                                        )
                                    };
                                }
                            };

                            return cleanUpReferenceBlocks(res);
                        };
                    }
                ],
                []
            );

            const saveCallablesResults: ProviderProps["saveCallablesResults"] = useMemo(
                () => [
                    ...(props.saveCallablesResults || []),
                    next => {
                        return ({ state, history = true }) => {
                            const res = next({ state, history });
                            if (res.state.template) {
                                setTemplateAtomValue(res.state.template);
                            }

                            return { state, history };
                        };
                    }
                ],
                []
            );

            const getCallableState: GetCallableState = next => state => {
                const callableState = next(state);

                return {
                    template: templateAtomValueRef.current as PbPageTemplate,
                    ...callableState
                };
            };

            return (
                <Component
                    {...props}
                    getElementTree={getElementTree}
                    getCallableState={[...(props.getCallableState || []), getCallableState]}
                    saveCallablesResults={saveCallablesResults}
                />
            );
        };
    }
);
