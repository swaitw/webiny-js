import {
    DynamicZoneContainer,
    MultiValueContainer,
    MultiValueItemContainer,
    MultiValueItem,
    TemplateGallery,
    useTemplate
} from "~/admin/plugins/fieldRenderers/dynamicZone";
import { ContentEntryForm as BaseContentEntryForm } from "./admin/components/ContentEntryForm/ContentEntryForm";
import { Header as ContentEntryFormHeader } from "./admin/components/ContentEntryForm/Header";
import { ContentEntryFormPreview } from "./admin/components/ContentEntryForm/ContentEntryFormPreview";
import { useContentEntryForm } from "./admin/components/ContentEntryForm/useContentEntryForm";
import { DefaultLayout } from "~/admin/components/ContentEntryForm/DefaultLayout";
import { useContentEntry } from "~/admin/views/contentEntries/hooks";
import { ContentEntry } from "~/admin/views/contentEntries/ContentEntry";
import { ContentEntryEditorConfig as BaseContentEntryEditorConfig } from "./admin/config/contentEntries";
import { SingletonContentEntry } from "~/admin/views/contentEntries/ContentEntry/SingletonContentEntry";
import { useSingletonContentEntry } from "~/admin/views/contentEntries/hooks/useSingletonContentEntry";

export const ContentEntryEditorConfig = Object.assign(BaseContentEntryEditorConfig, {
    ContentEntry: Object.assign(ContentEntry, {
        useContentEntry,
        DefaultLayout,
        ContentEntryForm: Object.assign(BaseContentEntryForm, {
            useContentEntryForm,
            Header: ContentEntryFormHeader
        }),
        ContentEntryFormPreview
    }),
    SingletonContentEntry: Object.assign(SingletonContentEntry, {
        useSingletonContentEntry
    }),
    FieldRenderers: {
        DynamicZone: {
            Template: {
                useTemplate
            },
            Container: DynamicZoneContainer,
            // SingleValue: {
            //     Container: null,
            //     ItemContainer: null,
            //     Item: null
            // },
            MultiValue: {
                Container: MultiValueContainer,
                ItemContainer: MultiValueItemContainer,
                Item: MultiValueItem
            },
            TemplateGallery
        }
    }
});
