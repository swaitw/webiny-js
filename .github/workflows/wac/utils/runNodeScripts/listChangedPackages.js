const args = process.argv.slice(2); // Removes the first two elements
const [detectedChangedFilesString] = args;
const detectedChangedFiles = JSON.parse(detectedChangedFilesString);

const changedPackages = detectedChangedFiles
    .filter(path => path.startsWith("packages/"))
    .reduce((acc, item) => {
        const [, packageName] = item.split("/");
        acc.add(packageName);
        return acc;
    }, new Set());

console.log(JSON.stringify(Array.from(changedPackages)));
