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

export const DELETE_LOCALE = /* GraphQL */ `
    mutation DeleteI18NLocale($code: String!) {
        i18n {
            deleteI18NLocale(code: $code) {
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
