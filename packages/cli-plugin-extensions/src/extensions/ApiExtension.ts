import { AbstractExtension } from "./AbstractExtension";
import path from "path";
import { EXTENSIONS_ROOT_FOLDER } from "~/utils/constants";
import { ArrayLiteralExpression, Node, Project } from "ts-morph";
import { formatCode } from "@webiny/cli-plugin-scaffold/utils";
import { updateDependencies, updateWorkspaces } from "~/utils";
import Case from "case";
import { ExtensionMessage } from "~/types";

export class ApiExtension extends AbstractExtension {
    async link() {
        await this.addPluginToApiApp();

        // Update dependencies list in package.json.
        const packageJsonPath = path.join("apps", "api", "graphql", "package.json");
        await updateDependencies(packageJsonPath, {
            [this.params.packageName]: "1.0.0"
        });

        await updateWorkspaces(this.params.location);
    }

    getNextSteps(): ExtensionMessage[] {
        let { location: extensionsFolderPath } = this.params;
        if (!extensionsFolderPath) {
            extensionsFolderPath = `${EXTENSIONS_ROOT_FOLDER}/${this.params.name}`;
        }

        const watchCommand = `yarn webiny watch api --env dev`;
        const indexTsFilePath = `${extensionsFolderPath}/src/index.ts`;

        return [
            { text: `run %s to start local development`, variables: [watchCommand] },
            { text: `open %s and start coding`, variables: [indexTsFilePath] },
            {
                text: `to install additional dependencies, run %s`,
                variables: [`yarn workspace ${this.params.packageName} add <package-name>`]
            }
        ];
    }

    private async addPluginToApiApp() {
        const extensionsFilePath = path.join("apps", "api", "graphql", "src", "extensions.ts");

        const { packageName } = this.params;
        const extensionFactory = Case.pascal(packageName) + "ExtensionFactory";

        const importName = "{ createExtension as " + extensionFactory + " }";
        const importPath = packageName;

        const project = new Project();
        project.addSourceFileAtPath(extensionsFilePath);

        const source = project.getSourceFileOrThrow(extensionsFilePath);

        const existingImportDeclaration = source.getImportDeclaration(importPath);
        if (existingImportDeclaration) {
            return;
        }

        let index = 1;

        const importDeclarations = source.getImportDeclarations();
        if (importDeclarations.length) {
            const last = importDeclarations[importDeclarations.length - 1];
            index = last.getChildIndex() + 1;
        }

        source.insertImportDeclaration(index, {
            defaultImport: importName,
            moduleSpecifier: importPath
        });

        const pluginsArray = source.getFirstDescendant(node =>
            Node.isArrayLiteralExpression(node)
        ) as ArrayLiteralExpression;

        pluginsArray.addElement(`${extensionFactory}()`);

        await source.save();

        await formatCode(extensionsFilePath, {});
    }
}
