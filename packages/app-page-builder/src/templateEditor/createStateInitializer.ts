import omit from "lodash/omit";
import { templateAtom } from "~/templateEditor/state";
import { EditorStateInitializerFactory } from "~/editor/Editor";
import { PbPageTemplate, PbPageTemplateWithContent } from "~/types";

export const createStateInitializer = (
    template: PbPageTemplateWithContent
): EditorStateInitializerFactory => {
    return () => ({
        content: template.content,
        recoilInitializer({ set }) {
            /**
             * We always unset the content because we are not using it via the template atom.
             */
            const templateData: PbPageTemplate = omit(template, ["content"]);

            set(templateAtom, templateData);
        }
    });
};
