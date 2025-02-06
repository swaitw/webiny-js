import path from "path";
import fs from "fs-extra";

describe("Telemetry events test", () => {
    test("should send telemetry events", async () => {
        const events: string[] = [
            "project-deploy-start",
            "project-deploy-end",
            "project-deploy-error",
            "project-deploy-error-graceful"
        ];

        const deployScript = await fs.readFile(
            path.resolve(__dirname, "..", "src", "cli", "deploy", "deploy.ts")
        );

        for (const event of events) {
            expect(deployScript.includes(event)).toBe(true);
        }
    });
});
