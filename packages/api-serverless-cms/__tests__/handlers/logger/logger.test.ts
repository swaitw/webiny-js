import { useGraphQlHandler } from "~tests/handlers/graphQlHandler";

describe("logger graphql", () => {
    const { getLog, listLogs, login, logout } = useGraphQlHandler({
        path: "/graphql",
        features: true
    });

    beforeEach(async () => {
        logout();
        process.env.S3_BUCKET = "a-mock-s3-bucket-which-does-not-exist";
    });

    it("should list all logs", async () => {
        const [notAuthorizedResult] = await listLogs();

        expect(notAuthorizedResult).toMatchObject({
            data: {
                logs: {
                    listLogs: {
                        data: null,
                        meta: null,
                        error: {
                            code: "SECURITY_NOT_AUTHORIZED",
                            data: null,
                            message: "Not authorized!"
                        }
                    }
                }
            }
        });

        login();

        const [result] = await listLogs();

        expect(result).toEqual({
            data: {
                logs: {
                    listLogs: {
                        data: [],
                        meta: {
                            cursor: null,
                            hasMoreItems: false,
                            totalCount: -1
                        },
                        error: null
                    }
                }
            }
        });
    });

    it("should get a single log", async () => {
        const [notAuthorizedResult] = await getLog({
            variables: {
                where: {
                    id: "1"
                }
            }
        });

        expect(notAuthorizedResult).toMatchObject({
            data: {
                logs: {
                    getLog: {
                        data: null,
                        error: {
                            code: "SECURITY_NOT_AUTHORIZED",
                            data: null,
                            message: "Not authorized!"
                        }
                    }
                }
            }
        });

        login();

        const [result] = await getLog({
            variables: {
                where: {
                    id: "1"
                }
            }
        });

        expect(result).toMatchObject({
            data: {
                logs: {
                    getLog: {
                        data: null,
                        error: {
                            code: "NOT_FOUND",
                            data: null,
                            message: "Not found."
                        }
                    }
                }
            }
        });
    });
});
