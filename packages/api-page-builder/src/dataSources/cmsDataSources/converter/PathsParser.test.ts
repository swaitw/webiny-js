import { PathsParser } from "./PathsParser";

describe("PathsParser", () => {
    it("should generate a simple selection", () => {
        const paths = ["title", "content"];
        const result = new PathsParser().parse(paths);
        expect(result).toEqual({
            title: true,
            content: true
        });
    });

    it("should generate nested selections", () => {
        const paths = ["title", "cta.link", "cta.label"];
        const result = new PathsParser().parse(paths);
        expect(result).toEqual({
            title: true,
            cta: {
                link: true,
                label: true
            }
        });
    });

    it("should handle array fields with nested properties", () => {
        const paths = ["testimonials", "testimonials.name", "testimonials.text"];
        const result = new PathsParser().parse(paths);
        expect(result).toEqual({
            testimonials: {
                name: true,
                text: true
            }
        });
    });

    it("should handle fields that appear both as leaf and parent nodes", () => {
        const paths = ["user", "user.id", "user.profile", "user.profile.name"];
        const result = new PathsParser().parse(paths);
        expect(result).toEqual({
            user: {
                id: true,
                profile: {
                    name: true
                }
            }
        });
    });

    it("should handle multiple nested levels", () => {
        const paths = ["data.user.profile.name", "data.user.profile.email", "data.user.settings"];
        const result = new PathsParser().parse(paths);
        expect(result).toEqual({
            data: {
                user: {
                    profile: {
                        name: true,
                        email: true
                    },
                    settings: true
                }
            }
        });
    });
});
