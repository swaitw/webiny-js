export const CREATE_LOCALE = /* GraphQL */ `
    mutation CreateI18NLocale($data: I18NLocaleInput!) {
        i18n {
            createI18NLocale(data: $data) {
                data {
                    code
                }
                error {
                    message
                    code
                }
            }
        }
    }
`;
