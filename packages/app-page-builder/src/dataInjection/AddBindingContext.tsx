import React from "react";
import { Element } from "@webiny/app-page-builder-elements";
import { BindingProvider } from "./BindingProvider";
import { useDynamicDocument } from "./useDynamicDocument";

// TODO: find a better way to manage this!
const addPrefixForTypes = ["grid", "repeater"];

export const AddBindingContext = Element.createDecorator(Original => {
    return function WithBindPrefixContext(props) {
        const { dataBindings } = useDynamicDocument();

        const { element } = props;

        const renderOriginal = <Original {...props} />;

        if (!element) {
            return renderOriginal;
        }

        if (!addPrefixForTypes.includes(element.type)) {
            return renderOriginal;
        }

        const myBinding = dataBindings.find(binding => {
            return binding.bindTo === `element:${element.id}.dataSource`;
        });

        if (!myBinding) {
            return renderOriginal;
        }

        return (
            <BindingProvider binding={myBinding}>
                <Original {...props} />
            </BindingProvider>
        );
    };
});
