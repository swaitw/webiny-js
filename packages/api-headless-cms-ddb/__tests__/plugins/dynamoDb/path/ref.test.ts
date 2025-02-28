import refPath from "../../../../src/dynamoDb/path/ref";
import { CmsModelField } from "@webiny/api-headless-cms/types";

describe("dynamodb path ref", () => {
    it("should get the ref path", () => {
        const plugin = refPath();

        const result = plugin.createPath({
            field: {
                fieldId: "authors"
            } as CmsModelField
        });

        expect(result).toEqual("authors.entryId");
    });

    const indexes = [[2], [3], [5], ["a"], [98244]];

    test.each(indexes)(
        'should create a path with an index - "authors.%s.entryId"',
        (index: any) => {
            const plugin = refPath();

            const result = plugin.createPath({
                field: {
                    fieldId: "authors"
                } as CmsModelField,
                index
            });

            expect(result).toEqual(`authors.${index}.entryId`);
        }
    );
});
