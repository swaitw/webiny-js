import React, { useMemo } from "react";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { Cell, Grid } from "@webiny/ui/Grid";
import { Alert } from "@webiny/ui/Alert";
import { AutoComplete } from "@webiny/ui/AutoComplete";
import styled from "@emotion/styled";
import { validation } from "@webiny/validation";
import Accordion from "@webiny/app-page-builder/editor/plugins/elementSettings/components/Accordion";
import {
    ButtonContainer,
    classes,
    SimpleButton
} from "@webiny/app-page-builder/editor/plugins/elementSettings/components/StyledComponents";
import {
    GET_FORM_REVISIONS,
    GetFormRevisionsQueryResponse,
    GetFormRevisionsQueryVariables,
    LIST_FORMS,
    ListFormsQueryResponse
} from "./graphql";
import { BindComponent, FormOnSubmit } from "@webiny/form";

const FormOptionsWrapper = styled("div")({
    minHeight: 250
});

interface FormElementAdvancedSettingsPropsData {
    settings: {
        form: {
            parent: string;
            revision?: string;
        };
    };
}

interface FormElementAdvancedSettingsProps {
    Bind: BindComponent;
    submit: FormOnSubmit;
    data: FormElementAdvancedSettingsPropsData;
}
interface RevisionsOutputOption {
    name: string;
    id: string;
}
interface RevisionsOutput {
    options: RevisionsOutputOption[];
    value: RevisionsOutputOption | null;
}
const FormElementAdvancedSettings = ({ Bind, submit, data }: FormElementAdvancedSettingsProps) => {
    const listQuery = useQuery<ListFormsQueryResponse>(LIST_FORMS, { fetchPolicy: "network-only" });

    const selectedForm = useMemo(() => {
        return {
            parent: data.settings?.form?.parent,
            revision: data.settings?.form?.revision
        };
    }, [data]);

    const [getFormRevisions, getQuery] = useLazyQuery<
        GetFormRevisionsQueryResponse,
        GetFormRevisionsQueryVariables
    >(GET_FORM_REVISIONS, {
        variables: {
            id: selectedForm.parent
        }
    });

    const latestRevisions = useMemo(() => {
        const output: RevisionsOutput = {
            options: [],
            value: null
        };
        if (listQuery.data) {
            const latestFormRevisionsList = listQuery.data.formBuilder?.listForms?.data || [];

            output.options = latestFormRevisionsList.map(({ id, name }) => ({ id, name }));
            output.value =
                output.options.find(item => {
                    if (typeof item.id !== "string" || typeof selectedForm.parent !== "string") {
                        return false;
                    }
                    // Get selected form's "baseId", i.e without the revision number suffix.
                    const [baseId] = selectedForm.parent.split("#");
                    return item.id.includes(baseId);
                }) || null;
        }

        return output;
    }, [listQuery, selectedForm]);

    const publishedRevisions = useMemo(() => {
        const output: RevisionsOutput = {
            options: [],
            value: null
        };

        if (getQuery.data?.formBuilder?.getFormRevisions?.data) {
            const publishedRevisions = getQuery.data.formBuilder.getFormRevisions.data.filter(
                revision => revision.published
            );
            output.options = publishedRevisions.map(item => ({
                id: item.id,
                name: `${item.name} (version ${item.version})`
            }));

            if (output.options.length > 0) {
                output.options.unshift({
                    id: "latest",
                    name: "Latest published revision"
                });
            }

            output.value = output.options.find(item => item.id === selectedForm.revision) || null;
        }

        return output;
    }, [getQuery, selectedForm]);
    // required so ts build does not break
    const buttonProps: any = {};

    return (
        <Accordion title={"Form"} defaultValue={true}>
            <FormOptionsWrapper>
                <Grid className={classes.simpleGrid}>
                    <Cell span={12}>
                        <Bind
                            name={"settings.form.parent"}
                            validators={validation.create("required")}
                        >
                            {({ onChange }) => (
                                <AutoComplete
                                    options={latestRevisions.options}
                                    value={latestRevisions.value || undefined}
                                    onChange={value => {
                                        onChange(value);
                                        getFormRevisions();
                                    }}
                                    label={"Form"}
                                />
                            )}
                        </Bind>
                    </Cell>
                    <Cell span={12}>
                        <Bind
                            name={"settings.form.revision"}
                            validators={validation.create("required")}
                        >
                            {({ onChange }) => {
                                const parentSelected = !!latestRevisions.value;
                                const noPublished = publishedRevisions.options.length === 0;
                                if (getQuery.loading) {
                                    return <span>Loading revisions...</span>;
                                }

                                const description = "Choose a published revision.";
                                if (parentSelected && noPublished) {
                                    return (
                                        <Alert type="danger" title="Form not published">
                                            Please publish the form and then you can insert it into
                                            your page.
                                        </Alert>
                                    );
                                } else {
                                    return (
                                        <AutoComplete
                                            label={"Revision"}
                                            description={description}
                                            disabled={!parentSelected || noPublished}
                                            options={publishedRevisions.options}
                                            value={publishedRevisions.value || undefined}
                                            onChange={onChange}
                                        />
                                    );
                                }
                            }}
                        </Bind>
                    </Cell>
                    <Cell span={12}>
                        <ButtonContainer {...buttonProps}>
                            <SimpleButton onClick={submit} {...buttonProps}>
                                Save
                            </SimpleButton>
                        </ButtonContainer>
                    </Cell>
                </Grid>
            </FormOptionsWrapper>
        </Accordion>
    );
};

export default FormElementAdvancedSettings;
