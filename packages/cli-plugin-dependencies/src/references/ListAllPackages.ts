// @ts-expect-error
import getPackages from "get-yarn-workspaces";

export class ListAllPackages {
    public list(path: string): string[] {
        return getPackages(path);
    }
}
