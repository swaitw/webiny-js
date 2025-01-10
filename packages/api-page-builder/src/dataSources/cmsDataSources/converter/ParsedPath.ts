import { SelectionPath } from "./types";

export class ParsedPath {
    public readonly key: string;
    public readonly fragment: string | undefined;
    public readonly remaining: string;

    private constructor(path: SelectionPath) {
        // Match pattern: key.[Type].remaining, or key.remaining, or just key
        const fragmentMatch = path.match(/^([^.\[]+)(?:\.(?:\[([^\]]+)\]|([^.\[]+)))?(.*)$/);

        this.key = path as string;
        this.remaining = "";

        if (fragmentMatch) {
            const [, key, fragment, normalField, remaining] = fragmentMatch;
            this.key = key;
            this.fragment = fragment || undefined;
            this.remaining = normalField
                ? normalField + (remaining || "")
                : (remaining || "").replace(/^\./, ""); // Remove leading dot if present
        }
    }

    static create(path: SelectionPath) {
        return new ParsedPath(path);
    }
}
