const ensureSystemRequirements = () => {
    // Just in case, we want to allow users to skip the system requirements check.
    const skipSystemRequirementsCheck = process.argv.includes("--no-system-requirements-check");
    if (skipSystemRequirementsCheck) {
        return;
    }

    const { SystemRequirements } = require("./SystemRequirements");

    const systemRequirements = SystemRequirements.validate();
    if (systemRequirements.valid) {
        return;
    }

    const chalk = require("chalk");

    console.log(
        [
            "One or more system requirements are not met.",
            "Please make sure to install the required versions of the following tools:"
        ].join("\n\n")
    );

    const Table = require("cli-table3");

    // Create a table instance
    const table = new Table({
        head: ["", "Current version", "Required version", "Valid"],
        style: { head: ["bold"] },
        colWidths: [10, 20, 20, 10]
    });

    const IS_VALID_TEXT = `${chalk.green("\u2713")} Yes`;
    const IS_INVALID_TEXT = `${chalk.red("\u2717")} No`;

    // Define the rows
    const { node, npm, npx, yarn } = systemRequirements;

    const rows = [
        [
            "Node.js",
            node.currentVersion,
            node.requiredVersion,
            node.valid ? IS_VALID_TEXT : IS_INVALID_TEXT
        ].map(v => {
            return node.valid ? v : chalk.red(v);
        }),
        [
            "NPM",
            npm.currentVersion,
            npm.requiredVersion,
            npm.valid ? IS_VALID_TEXT : IS_INVALID_TEXT
        ].map(v => {
            return npm.valid ? v : chalk.red(v);
        }),
        [
            "NPX",
            npx.currentVersion,
            npx.requiredVersion,
            npx.valid ? IS_VALID_TEXT : IS_INVALID_TEXT
        ].map(v => {
            return npx.valid ? v : chalk.red(v);
        }),
        [
            "Yarn",
            yarn.currentVersion,
            yarn.requiredVersion,
            yarn.valid ? IS_VALID_TEXT : IS_INVALID_TEXT
        ].map(v => {
            return yarn.valid ? v : chalk.red(v);
        })
    ];

    // Add rows to the table
    rows.forEach(row => table.push(row));

    // Print the table to the console
    console.log(table.toString());

    console.log(
        [
            "If you think this is a mistake, you can also try skipping",
            "the system requirements checks by appending the",
            `${chalk.red("--no-system-requirements-check")} flag.`
        ].join(" ")
    );

    console.log();
    console.log("For more information, please visit https://webiny.link/prerequisites.");
    process.exit();
};

module.exports = { ensureSystemRequirements };
