import { createModelField } from "~/utils/createModelField";
import { createPrivateModel } from "@webiny/api-headless-cms";

const titleField = () =>
    createModelField({
        label: "Title",
        type: "text",
        validation: [
            {
                name: "required",
                message: "Value is required."
            }
        ]
    });

const slugField = () =>
    createModelField({
        label: "Slug",
        type: "text",
        validation: [
            {
                name: "required",
                message: "Value is required."
            },
            {
                name: "pattern",
                settings: {
                    preset: "custom",
                    regex: "^[a-z0-9]+(-[a-z0-9]+)*$",
                    flags: "g"
                },
                message: "Value must consist of only 'a-z', '0-9' and '-'."
            }
        ]
    });

const typeField = () =>
    createModelField({
        label: "Type",
        type: "text",
        validation: [
            {
                name: "required",
                message: "Value is required."
            }
        ]
    });

const parentIdField = () =>
    createModelField({
        label: "Parent Id",
        type: "text"
    });

const permissionsField = () =>
    createModelField({
        label: "Permissions",
        fieldId: "permissions",
        type: "object",
        multipleValues: true,
        listValidation: [],
        settings: {
            fields: [
                {
                    id: "target",
                    type: "text",
                    storageId: "text@target",
                    fieldId: "target",
                    label: "Target",
                    validation: [
                        {
                            name: "required",
                            message: "Value is required."
                        }
                    ]
                },
                {
                    id: "level",
                    type: "text",
                    storageId: "text@level",
                    fieldId: "level",
                    label: "Level",
                    validation: [
                        {
                            name: "required",
                            message: "Value is required."
                        }
                    ],
                    predefinedValues: {
                        enabled: true,
                        values: [
                            {
                                label: "Viewer",
                                value: "viewer"
                            },
                            {
                                label: "Editor",
                                value: "editor"
                            },
                            {
                                label: "Owner",
                                value: "owner"
                            },
                            {
                                label: "Public",
                                value: "public"
                            }
                        ]
                    }
                }
            ],
            layout: [["target"], ["level"]]
        }
    });

export const FOLDER_MODEL_ID = "acoFolder";

export const createFolderModel = () => {
    return createPrivateModel({
        name: "ACO - Folder",
        modelId: FOLDER_MODEL_ID,
        authorization: {
            // Disables base permission checks, but leaves FLP checks enabled.
            permissions: false

            // We're leaving FLP enabled (no need to set `flp: true`).
            // flp: true
        },
        titleFieldId: "title",
        fields: [titleField(), slugField(), typeField(), parentIdField(), permissionsField()]
    });
};
