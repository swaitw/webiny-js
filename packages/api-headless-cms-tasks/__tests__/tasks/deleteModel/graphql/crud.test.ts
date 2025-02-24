import { useHandler } from "~tests/context/useHandler";
import { createStoreKey } from "~/tasks/deleteModel/helpers/store";
import { IStoreValue } from "~/tasks/deleteModel/types";

describe("crud", () => {
    it("should list models being deleted", async () => {
        const { handler, identity, tenant, locale } = useHandler();
        const context = await handler();

        const results = await context.cms.listModelsBeingDeleted();
        expect(results).toHaveLength(0);

        const value: IStoreValue = {
            modelId: "modelId",
            task: "task",
            identity,
            tenant: tenant.id,
            locale
        };

        await context.db.store.storeValue(createStoreKey(value), value);

        const secondaryContext = await handler();

        const resultsPopulated = await secondaryContext.cms.listModelsBeingDeleted();
        expect(resultsPopulated).toHaveLength(1);
        expect(resultsPopulated).toEqual([value]);

        await context.db.store.removeValue(createStoreKey(value));

        const tertiaryContext = await handler();

        const resultsRemoved = await tertiaryContext.cms.listModelsBeingDeleted();
        expect(resultsRemoved).toHaveLength(0);
    });

    it("should start delete of the model", async () => {
        const { handler, identity, tenant, locale } = useHandler();
        const context = await handler();

        const group = await context.cms.createGroup({
            name: "group",
            description: "description",
            id: "group",
            icon: "icon"
        });

        const model = await context.cms.createModel({
            modelId: "modelId",
            description: "description",
            name: "name",
            fields: [],
            layout: [],
            singularApiName: "SingularApiName",
            pluralApiName: "PluralApiName",
            group: group.id
        });

        const secondaryContext = await handler();
        const tertiaryContext = await handler();

        const fullyDeleteResult = await context.cms.fullyDeleteModel(model.modelId);
        expect(fullyDeleteResult).toEqual({
            total: 0,
            deleted: 0,
            status: "running",
            id: expect.any(String)
        });
        const value: IStoreValue = {
            modelId: model.modelId,
            task: fullyDeleteResult.id,
            identity,
            tenant: tenant.id,
            locale
        };

        const results = await context.cms.listModelsBeingDeleted();
        expect(results).toHaveLength(1);
        expect(results).toEqual([
            {
                ...value,
                task: fullyDeleteResult.id
            }
        ]);

        const cancelDeleteResult = await secondaryContext.cms.cancelFullyDeleteModel(model.modelId);

        expect(cancelDeleteResult).toEqual({
            total: 0,
            deleted: 0,
            status: "canceled",
            id: expect.any(String)
        });

        const resultsCanceled = await tertiaryContext.cms.listModelsBeingDeleted();
        expect(resultsCanceled).toHaveLength(0);
    });
});
