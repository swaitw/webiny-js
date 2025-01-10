import { ParsedPath } from "./ParsedPath";
import type { Fragment, GraphQLSelection } from "./types";

export class PathsParser {
    parse(paths: string[]) {
        const selection: GraphQLSelection = {};

        // Sort paths to ensure parent paths come after child paths
        const sortedPaths = [...paths].sort((a, b) => b.length - a.length);

        sortedPaths.forEach(path => {
            let current = selection;
            let remainingPath = path;

            while (remainingPath) {
                const { key, fragment, remaining } = ParsedPath.create(remainingPath);
                remainingPath = remaining;

                if (!fragment) {
                    // Handle regular field
                    if (!remainingPath) {
                        // Don't overwrite existing object with true
                        if (typeof current[key] !== "object") {
                            current[key] = true;
                        }
                    } else {
                        if (!current[key] || current[key] === true) {
                            current[key] = {};
                        }
                        current = current[key] as GraphQLSelection;
                    }
                } else {
                    // Handle fragment
                    if (!current[key] || current[key] === true) {
                        current[key] = {};
                    }

                    const fragmentContainer = current[key] as GraphQLSelection;
                    const fragmentKey = `fragment_${fragment}`;

                    if (!fragmentContainer[fragmentKey]) {
                        fragmentContainer[fragmentKey] = {
                            type: fragment,
                            fields: {}
                        } as Fragment;
                    }

                    if (remaining) {
                        current = (fragmentContainer[fragmentKey] as Fragment).fields;
                    }
                }
            }
        });

        return selection;
    }
}
