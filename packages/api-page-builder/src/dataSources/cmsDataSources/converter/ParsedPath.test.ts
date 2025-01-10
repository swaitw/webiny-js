import { ParsedPath } from "./ParsedPath";

describe("Path Parser", () => {
    it("should parse simple field", () => {
        const result = ParsedPath.create("title");
        expect(result).toEqual({
            key: "title",
            fragment: undefined,
            remaining: ""
        });
    });

    it("should parse nested field", () => {
        const result = ParsedPath.create("user.name");
        expect(result).toEqual({
            key: "user",
            fragment: undefined,
            remaining: "name"
        });
    });

    it("should parse fragment field", () => {
        const result = ParsedPath.create("content.[Hero].title");
        expect(result).toEqual({
            key: "content",
            fragment: "Hero",
            remaining: "title"
        });
    });

    it("should parse nested fragment field", () => {
        const result = ParsedPath.create("sections.[Hero].content.[Text].body");
        expect(result).toEqual({
            key: "sections",
            fragment: "Hero",
            remaining: "content.[Text].body"
        });
    });

    it("should handle field with no remaining path", () => {
        const result = ParsedPath.create("user");
        expect(result).toEqual({
            key: "user",
            fragment: undefined,
            remaining: ""
        });
    });

    it("should handle fragment with no remaining path", () => {
        const result = ParsedPath.create("content.[Hero]");
        expect(result).toEqual({
            key: "content",
            fragment: "Hero",
            remaining: ""
        });
    });
});
