import React from "react";
import styled from "@emotion/styled";
import { i18n } from "@webiny/app/i18n";
import { Form } from "@webiny/form";
import { Grid, Cell } from "@webiny/ui/Grid";
import { ButtonDefault, ButtonIcon, ButtonPrimary } from "@webiny/ui/Button";
import { CircularProgress } from "@webiny/ui/Progress";
import {
    SimpleForm,
    SimpleFormFooter,
    SimpleFormContent,
    SimpleFormHeader
} from "@webiny/app-admin/components/SimpleForm";
import { validation } from "@webiny/validation";
import EmptyView from "@webiny/app-admin/components/EmptyView";
import { ReactComponent as AddIcon } from "@webiny/app-admin/assets/icons/add-18px.svg";
import { useTenantForm } from "./hooks/useTenantForm";
import { Input } from "@webiny/ui/Input";

const t = i18n.ns("app-i18n/admin/locales/form");

const ButtonWrapper = styled("div")({
    display: "flex",
    justifyContent: "space-between"
});

const TenantForm = () => {
    const { loading, showEmptyView, createTenant, cancelEditing, tenant, onSubmit } =
        useTenantForm();

    // Render "No content" selected view.
    if (showEmptyView) {
        return (
            <EmptyView
                title={t`Click on the left side list to display tenant details or create a...`}
                action={
                    <ButtonDefault data-testid="new-record-button" onClick={createTenant}>
                        <ButtonIcon icon={<AddIcon />} /> {t`New Tenant`}
                    </ButtonDefault>
                }
            />
        );
    }

    return (
        <Form data={tenant} onSubmit={onSubmit}>
            {({ data, form, Bind }) => (
                <SimpleForm data-testid={"tenant-form"}>
                    {loading && <CircularProgress />}
                    <SimpleFormHeader title={data.name || t`New tenant`} />
                    <SimpleFormContent>
                        <Grid>
                            <Cell span={12}>
                                <Bind name="name" validators={validation.create("required")}>
                                    <Input label={"Name"} />
                                </Bind>
                            </Cell>
                        </Grid>
                        <Grid>
                            <Cell span={12}>
                                <Bind name="description" validators={validation.create("required")}>
                                    <Input label={"Description"} rows={4} />
                                </Bind>
                            </Cell>
                        </Grid>
                    </SimpleFormContent>
                    <SimpleFormFooter>
                        <ButtonWrapper>
                            <ButtonDefault onClick={cancelEditing}>{t`Cancel`}</ButtonDefault>
                            <ButtonPrimary onClick={form.submit}>{t`Save tenant`}</ButtonPrimary>
                        </ButtonWrapper>
                    </SimpleFormFooter>
                </SimpleForm>
            )}
        </Form>
    );
};

export default TenantForm;
