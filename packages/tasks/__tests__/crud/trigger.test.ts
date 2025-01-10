import { useRawHandler } from "~tests/helpers/useRawHandler";
import { createMockTaskDefinition, createMockTaskDefinitions } from "~tests/mocks/definition";
import { createMockIdentity } from "~tests/mocks/identity";
import { ITaskDataInput, TaskDataStatus } from "~/types";

interface IMockDefinitionInput extends ITaskDataInput {
    file: string;
    page: number;
    take: boolean;
}

describe("trigger crud", () => {
    const handler = useRawHandler({
        plugins: [...createMockTaskDefinitions()]
    });

    it("should trigger a task", async () => {
        const context = await handler.handle();

        const result = await context.tasks.trigger({
            definition: "myCustomTaskNumber1",
            name: "A test of triggering task",
            input: {
                myAnotherCustomValue: "myAnotherCustomValue",
                myCustomValue: "myCustomValue"
            }
        });

        expect(result).toEqual({
            id: expect.toBeString(),
            name: "A test of triggering task",
            definitionId: "myCustomTaskNumber1",
            executionName: "",
            input: {
                myAnotherCustomValue: "myAnotherCustomValue",
                myCustomValue: "myCustomValue"
            },
            iterations: 0,
            taskStatus: TaskDataStatus.PENDING,
            createdBy: createMockIdentity(),
            createdOn: expect.stringMatching(/^20/),
            savedOn: expect.stringMatching(/^20/),
            startedOn: undefined,
            finishedOn: undefined,
            eventResponse: expect.any(Object)
        });
    });

    it("should validate input before triggering the task", async () => {
        const definition = createMockTaskDefinition<IMockDefinitionInput>({
            createInputValidation: ({ validator }) => {
                return {
                    file: validator.string(),
                    page: validator.number(),
                    take: validator.boolean()
                };
            }
        });

        const handler = useRawHandler({
            plugins: [definition]
        });

        const context = await handler.handle();

        try {
            const result = await context.tasks.trigger({
                definition: definition.id,
                name: "A test of triggering task",
                input: {
                    wrongValueKey: "wrong",
                    anotherWrongValueKey: "wrong again"
                }
            });
            expect(result).toEqual("Should not reach this point.");
        } catch (ex) {
            expect(ex.message).toEqual("Validation failed.");
            expect(ex.data).toEqual({
                invalidFields: {
                    file: {
                        code: "invalid_type",
                        data: {
                            fatal: undefined,
                            path: ["file"]
                        },
                        message: "Required"
                    },
                    page: {
                        code: "invalid_type",
                        data: {
                            fatal: undefined,
                            path: ["page"]
                        },
                        message: "Required"
                    },
                    take: {
                        code: "invalid_type",
                        data: {
                            fatal: undefined,
                            path: ["take"]
                        },
                        message: "Required"
                    }
                }
            });
        }

        const input = {
            file: "correct",
            page: 1,
            take: false
        };

        try {
            const result = await context.tasks.trigger({
                definition: definition.id,
                name: "A test of triggering task",
                input
            });
            expect(result).toMatchObject({
                id: expect.any(String),
                input
            });
        } catch (ex) {
            expect(ex.message).toEqual("Should not reach this point.");
        }
    });
});
