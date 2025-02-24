import fs from "fs";
import path from "path";

class LocalFile {
    private readonly filePath: string;

    public constructor(filePath: string) {
        this.filePath = filePath;
    }

    public exists(): boolean {
        return fs.existsSync(this.filePath);
    }

    public getAbsolutePath(): string {
        return this.filePath;
    }
}

export class WebinyConfigFile {
    private readonly potentialConfigs: LocalFile[];

    public constructor(root: string) {
        this.potentialConfigs = [
            new LocalFile(path.join(root, "webiny.config.ts")),
            new LocalFile(path.join(root, "webiny.config.js"))
        ];
    }

    public static forWorkspace(workspace: string) {
        return new WebinyConfigFile(path.resolve(workspace));
    }

    public getAbsolutePath(): string | undefined {
        const file = this.potentialConfigs.find(file => file.exists());
        if (!file) {
            return undefined;
        }

        return file.getAbsolutePath();
    }
}
