import { Fragment, GraphQLSelection } from "./types";

export class SelectionFormatter {
    /**
     * Converts a GraphQL selection object into a formatted GraphQL query string
     * @param selection GraphQL selection object
     * @param indent Indentation level
     * @returns Formatted GraphQL query string
     */
    formatSelection(selection: GraphQLSelection, indent = 0): string {
        const lines: string[] = ["{"];

        Object.entries(selection).forEach(([key, value]) => {
            if (value === true) {
                lines.push(key);
            } else if ("type" in value && "fields" in value) {
                // Handle fragment
                const fragment = value as Fragment;
                lines.push(
                    `... on ${fragment.type} ${this.formatSelection(fragment.fields, indent + 1)}`
                );
            } else {
                // Handle regular nested fields
                const fragments = Object.entries(value as GraphQLSelection)
                    .filter(([k]) => k.startsWith("fragment_"))
                    .map(([, v]) => v as Fragment);

                const regularFields = Object.entries(value as GraphQLSelection)
                    .filter(([k]) => !k.startsWith("fragment_"))
                    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

                if (Object.keys(regularFields).length > 0) {
                    lines.push(`${key} ${this.formatSelection(regularFields, indent + 1)}`);
                } else if (fragments.length > 0) {
                    lines.push(`${key} {`);
                    fragments.forEach(fragment => {
                        lines.push(
                            `... on ${fragment.type} ${this.formatSelection(
                                fragment.fields,
                                indent + 2
                            )}`
                        );
                    });
                    lines.push(`}`);
                }
            }
        });

        lines.push(`}`);
        return lines.join("\n");
    }
}
