import { Graph } from "graphlib";

export function printGraph(graph: Graph): string {
    const graphLines: string[] = [];

    function printNode(nodeId: string, depth: number, isLast: boolean, hasVerticalLine: boolean[]) {
        // Construct the indentation string based on `hasVerticalLine`
        const indent =
            hasVerticalLine
                .slice(0, depth)
                .map(isConnector => (isConnector ? "│  " : "   "))
                .join("") + (depth > 0 ? (isLast ? "└─ " : "├─ ") : "");

        graphLines.push(`${indent}${nodeId}`);

        const successors = graph.successors(nodeId) || [];
        if (successors.length === 0) {
            // Align "No dependencies." as a child, with proper vertical line connectors
            const noDepsIndent =
                hasVerticalLine
                    .slice(0, depth)
                    .map(isConnector => (isConnector ? "│  " : "   "))
                    .join("") + (isLast ? "   └─ No dependencies." : "│  └─ No dependencies.");
            graphLines.push(noDepsIndent);
            return;
        }

        // Update `hasVerticalLine` array to control vertical lines at each level
        const newHasVerticalLine = [...hasVerticalLine, !isLast];
        successors.forEach((successor, index) => {
            const isLastSuccessor = index === successors.length - 1;
            printNode(successor, depth + 1, isLastSuccessor, newHasVerticalLine);
        });
    }

    const rootNodeId = graph.nodes()[0];
    printNode(rootNodeId, 0, true, []);

    return graphLines.join("\n");
}
