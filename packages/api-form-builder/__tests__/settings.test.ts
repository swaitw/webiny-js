import useGqlHandler from "./useGqlHandler";
import { GET_SETTINGS } from "~tests/graphql/formBuilderSettings";

describe("Settings Test", () => {
    const {
        getSettings,
        updateSettings,
        install,
        createI18NLocale,
        deleteI18NLocale,
        isInstalled
    } = useGqlHandler();

    it(`Should not be able to get & update settings before "install"`, async () => {
        // Should not have any settings without install
        const [getSettingsResponse] = await getSettings();

        expect(getSettingsResponse).toEqual({
            data: {
                formBuilder: {
                    getSettings: {
                        data: null,
                        error: {
                            code: "NOT_FOUND",
                            data: null,
                            message: `"Form Builder" settings not found!`
                        }
                    }
                }
            }
        });

        const [updateSettingsResponse] = await updateSettings({ data: { domain: "main" } });
        expect(updateSettingsResponse).toEqual({
            data: {
                formBuilder: {
                    updateSettings: {
                        data: null,
                        error: {
                            code: "NOT_FOUND",
                            data: null,
                            message: '"Form Builder" settings not found!'
                        }
                    }
                }
            }
        });
    });

    it("Should be able to install `Form Builder`", async () => {
        // "isInstalled" should return false prior "install"
        const [isInstalledResponse] = await isInstalled();

        expect(isInstalledResponse).toEqual({
            data: {
                formBuilder: {
                    version: null
                }
            }
        });

        // Let's install the `Form builder`
        const [installResponse] = await install({ domain: "http://localhost:3001" });

        expect(installResponse).toEqual({
            data: {
                formBuilder: {
                    install: {
                        data: true,
                        error: null
                    }
                }
            }
        });

        // "isInstalled" should return true after "install"
        const [response] = await isInstalled();

        expect(response).toEqual({
            data: {
                formBuilder: {
                    version: expect.any(String)
                }
            }
        });
    });

    it(`Should be able to get & update settings after "install"`, async () => {
        // Let's install the `Form builder`
        const [installResponse] = await install({ domain: "http://localhost:3001" });

        expect(installResponse).toEqual({
            data: {
                formBuilder: {
                    install: {
                        data: true,
                        error: null
                    }
                }
            }
        });

        // Should not have any settings without install
        const [getSettingsResponse] = await getSettings();

        expect(getSettingsResponse).toEqual({
            data: {
                formBuilder: {
                    getSettings: {
                        data: {
                            domain: "http://localhost:3001",
                            reCaptcha: {
                                enabled: null,
                                secretKey: null,
                                siteKey: null
                            }
                        },
                        error: null
                    }
                }
            }
        });

        const [updateSettingsResponse] = await updateSettings({
            data: { domain: "http://localhost:5001" }
        });
        expect(updateSettingsResponse).toEqual({
            data: {
                formBuilder: {
                    updateSettings: {
                        data: {
                            domain: "http://localhost:5001",
                            reCaptcha: {
                                enabled: null,
                                secretKey: null,
                                siteKey: null
                            }
                        },
                        error: null
                    }
                }
            }
        });

        const [getSettingsAfterUpdateResponse] = await getSettings();

        expect(getSettingsAfterUpdateResponse).toEqual({
            data: {
                formBuilder: {
                    getSettings: {
                        data: {
                            domain: "http://localhost:5001",
                            reCaptcha: {
                                enabled: null,
                                secretKey: null,
                                siteKey: null
                            }
                        },
                        error: null
                    }
                }
            }
        });
    });

    it(`Should be able to get & update settings after in a new locale`, async () => {
        // Let's install the `Form builder`
        await install({ domain: "http://localhost:3001" });

        await createI18NLocale({ data: { code: "de-DE" } });

        const { invoke } = useGqlHandler();

        // Had to do it via `invoke` directly because this way it's possible to
        // set the locale header. Wasn't easily possible via the `getSettings` helper.
        const [newLocaleFbSettings] = await invoke({
            body: { query: GET_SETTINGS },
            headers: { "x-i18n-locale": "default:de-DE;content:de-DE;" }
        });

        // Settings should exist in the newly created locale.
        expect(newLocaleFbSettings).toEqual({
            data: {
                formBuilder: {
                    getSettings: {
                        data: {
                            domain: null,
                            reCaptcha: {
                                enabled: null,
                                secretKey: null,
                                siteKey: null
                            }
                        },
                        error: null
                    }
                }
            }
        });
    });

    it(`Should be able to create a locale, delete it, and again create it`, async () => {
        // Let's install the `Form builder`
        await install({ domain: "http://localhost:3001" });

        await createI18NLocale({ data: { code: "en-US" } });
        await createI18NLocale({ data: { code: "de-DE" } });

        const [deleteDeLocaleResponse] = await deleteI18NLocale({ code: "de-DE" });
        expect(deleteDeLocaleResponse).toEqual({
            data: {
                i18n: {
                    deleteI18NLocale: {
                        data: { code: "de-DE" },
                        error: null
                    }
                }
            }
        });

        const [createDeLocaleResponse] = await createI18NLocale({ data: { code: "de-DE" } });
        expect(createDeLocaleResponse).toEqual({
            data: {
                i18n: {
                    createI18NLocale: {
                        data: {
                            code: "de-DE"
                        },
                        error: null
                    }
                }
            }
        });
    });
});
