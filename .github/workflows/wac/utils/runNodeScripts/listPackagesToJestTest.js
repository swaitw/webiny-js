const args = process.argv.slice(2); // Removes the first two elements
const [paramsString] = args;

const [packagesWithJestTestsList, changedPackages] = JSON.parse(paramsString);

const packagesToJestTest = packagesWithJestTestsList.filter(pkg => {
    return changedPackages.includes(pkg.packageName);
});

console.log(JSON.stringify(packagesToJestTest));
