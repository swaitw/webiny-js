import prettier from "prettier";
import { PathsParser } from "./PathsParser";
import { SelectionFormatter } from "./SelectionFormatter";

const prettyGql = (value: string) => {
    return prettier.format(value.trim(), { parser: "graphql" });
};

describe("SelectionFormatter", () => {
    const formatPaths = (paths: string[]) => {
        const parser = new PathsParser();
        const formatter = new SelectionFormatter();

        const selection = parser.parse(paths);

        return formatter.formatSelection(selection);
    };

    it("should handle fragments with new syntax", () => {
        const paths = [
            "content.[Hero].title",
            "content.[Hero].subtitle",
            "content.[Feature].name",
            "content.[Feature].description"
        ];
        const formatted = formatPaths(paths);
        const snapshot = /* GraphQL */ `
            {
                content {
                    ... on Feature {
                        description
                        name
                    }
                    ... on Hero {
                        subtitle
                        title
                    }
                }
            }
        `;
        expect(prettyGql(formatted)).toBe(prettyGql(snapshot));
    });

    it("should handle nested fragments with new syntax", () => {
        const paths = [
            "sections.[Hero].content.[Image].url",
            "sections.[Hero].content.[Text].body"
        ];
        const formatted = formatPaths(paths);
        const snapshot = /* GraphQL */ `
            {
                sections {
                    ... on Hero {
                        content {
                            ... on Image {
                                url
                            }
                            ... on Text {
                                body
                            }
                        }
                    }
                }
            }
        `;
        expect(prettyGql(formatted)).toBe(prettyGql(snapshot));
    });
});
