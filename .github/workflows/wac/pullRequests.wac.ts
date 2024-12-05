import { createWorkflow, NormalJob } from "github-actions-wac";
import { createJob } from "./jobs";
import {
    NODE_VERSION,
    BUILD_PACKAGES_RUNNER,
    listPackagesWithJestTests,
    AWS_REGION,
    runNodeScript,
    addToOutputs
} from "./utils";
import {
    createGlobalBuildCacheSteps,
    createInstallBuildSteps,
    createRunBuildCacheSteps,
    createYarnCacheSteps,
    withCommonParams
} from "./steps";

// Will print "next" or "dev". Important for caching (via actions/cache).
const DIR_WEBINY_JS = "${{ github.base_ref }}";

const installBuildSteps = createInstallBuildSteps({ workingDirectory: DIR_WEBINY_JS });
const yarnCacheSteps = createYarnCacheSteps({ workingDirectory: DIR_WEBINY_JS });
const globalBuildCacheSteps = createGlobalBuildCacheSteps({ workingDirectory: DIR_WEBINY_JS });
const runBuildCacheSteps = createRunBuildCacheSteps({ workingDirectory: DIR_WEBINY_JS });

const createJestTestsJobs = (storage: string | null) => {
    const constantsJobName = storage
        ? `jestTests${storage}Constants`
        : "jestTestsNoStorageConstants";
    const runJobName = storage ? `jestTests${storage}Run` : "jestTestsNoStorageRun";

    const env: Record<string, string> = { AWS_REGION };

    if (storage) {
        if (storage === "ddb-es") {
            env["AWS_ELASTIC_SEARCH_DOMAIN_NAME"] = "${{ secrets.AWS_ELASTIC_SEARCH_DOMAIN_NAME }}";
            env["ELASTIC_SEARCH_ENDPOINT"] = "${{ secrets.ELASTIC_SEARCH_ENDPOINT }}";
            env["ELASTIC_SEARCH_INDEX_PREFIX"] = "${{ matrix.package.id }}";
        } else if (storage === "ddb-os") {
            // We still use the same environment variables as for "ddb-es" setup, it's
            // just that the values are read from different secrets.
            env["AWS_ELASTIC_SEARCH_DOMAIN_NAME"] = "${{ secrets.AWS_OPEN_SEARCH_DOMAIN_NAME }}";
            env["ELASTIC_SEARCH_ENDPOINT"] = "${{ secrets.OPEN_SEARCH_ENDPOINT }}";
            env["ELASTIC_SEARCH_INDEX_PREFIX"] = "${{ matrix.package.id }}";
        }
    }

    const packagesWithJestTests = listPackagesWithJestTests({
        storage
    });

    const constantsJob: NormalJob = createJob({
        needs: ["constants", "build"],
        name: "Create Jest tests constants",
        "runs-on": "ubuntu-latest",
        outputs: {
            "packages-to-jest-test":
                "${{ steps.list-packages-to-jest-test.outputs.packages-to-jest-test }}"
        },
        steps: [
            {
                name: "List packages to test with Jest",
                id: "list-packages-to-jest-test",
                run: runNodeScript(
                    "listPackagesToJestTest",
                    `[${JSON.stringify(
                        packagesWithJestTests
                    )}, \${{ needs.constants.outputs.changed-packages }}]`,
                    { outputAs: "packages-to-jest-test" }
                )
            },
            {
                name: "Packages to test with Jest",
                id: "list-packages",
                run: "echo '${{ steps.list-packages-to-jest-test.outputs.packages-to-jest-test }}'"
            }
        ]
    });

    const runJob: NormalJob = createJob({
        needs: ["constants", "build", constantsJobName],
        name: "${{ matrix.package.cmd }}",
        strategy: {
            "fail-fast": false,
            matrix: {
                os: ["ubuntu-latest"],
                node: [NODE_VERSION],
                package: `$\{{ fromJson(needs.${constantsJobName}.outputs.packages-to-jest-test) }}`
            }
        },
        "runs-on": "${{ matrix.os }}",
        env,
        if: `needs.${constantsJobName}.outputs.packages-to-jest-test != '[]'`,
        awsAuth: storage === "ddb-es" || storage === "ddb-os",
        checkout: { path: DIR_WEBINY_JS },
        steps: [
            ...yarnCacheSteps,
            ...runBuildCacheSteps,
            ...installBuildSteps,
            {
                name: "Run tests",
                run: "yarn test ${{ matrix.package.cmd }}",
                "working-directory": DIR_WEBINY_JS
            }
        ]
    });

    // We prevent running of Jest tests if a PR was created from a fork.
    // This is because we don't want to expose our AWS credentials to forks.
    if (storage === "ddb-es" || storage === "ddb-os") {
        runJob.if += " && needs.constants.outputs.is-fork-pr != 'true'";
    }

    return {
        [constantsJobName]: constantsJob,
        [runJobName]: runJob
    };
};

export const pullRequests = createWorkflow({
    name: "Pull Requests",
    on: "pull_request",
    concurrency: {
        group: "pr-${{ github.event.pull_request.number }}",
        "cancel-in-progress": true
    },
    jobs: {
        // validateWorkflows: createValidateWorkflowsJob(),
        validateCommits: createJob({
            name: "Validate commit messages",
            if: "github.base_ref != 'dev'",
            steps: [{ uses: "webiny/action-conventional-commits@v1.3.0" }]
        }),
        // Don't allow "feat" commits to be merged into "dev" branch.
        validateCommitsDev: createJob({
            name: "Validate commit messages (dev branch, 'feat' commits not allowed)",
            if: "github.base_ref == 'dev'",
            steps: [
                {
                    uses: "webiny/action-conventional-commits@v1.3.0",
                    with: {
                        // If dev, use "dev" commit types, otherwise use "next" commit types.
                        "allowed-commit-types":
                            "fix,docs,style,refactor,test,build,perf,ci,chore,revert,merge,wip"
                    }
                }
            ]
        }),
        constants: createJob({
            name: "Create constants",
            outputs: {
                "global-cache-key": "${{ steps.global-cache-key.outputs.global-cache-key }}",
                "run-cache-key": "${{ steps.run-cache-key.outputs.run-cache-key }}",
                "is-fork-pr": "${{ steps.is-fork-pr.outputs.is-fork-pr }}",
                "changed-packages": "${{ steps.detect-changed-packages.outputs.changed-packages }}",
                "latest-webiny-version":
                    "${{ steps.latest-webiny-version.outputs.latest-webiny-version }}"
            },
            steps: [
                {
                    name: "Create global cache key",
                    id: "global-cache-key",
                    run: addToOutputs(
                        "global-cache-key",
                        '${{ github.base_ref }}-${{ runner.os }}-$(/bin/date -u "+%m%d")-${{ vars.RANDOM_CACHE_KEY_SUFFIX }}'
                    )
                },
                {
                    name: "Create workflow run cache key",
                    id: "run-cache-key",
                    run: addToOutputs(
                        "run-cache-key",
                        "${{ github.run_id }}-${{ github.run_attempt }}-${{ vars.RANDOM_CACHE_KEY_SUFFIX }}"
                    )
                },
                {
                    name: "Is a PR from a fork",
                    id: "is-fork-pr",
                    run: addToOutputs(
                        "is-fork-pr",
                        "${{ github.event.pull_request.head.repo.fork }}"
                    )
                },
                {
                    name: "Detect changed files",
                    id: "detect-changed-files",
                    uses: "dorny/paths-filter@v3",
                    with: {
                        filters: "changed:\n  - 'packages/**/*'\n",
                        "list-files": "json"
                    }
                },
                {
                    name: "Detect changed packages",
                    id: "detect-changed-packages",
                    run: runNodeScript(
                        "listChangedPackages",
                        "${{ steps.detect-changed-files.outputs.changed_files }}",
                        { outputAs: "changed-packages" }
                    )
                },
                {
                    name: "Get latest Webiny version on NPM",
                    id: "latest-webiny-version",
                    run: addToOutputs("latest-webiny-version", "$(npm view @webiny/cli version)")
                }
            ]
        }),
        assignMilestone: createJob({
            name: "Assign milestone",
            needs: "constants",
            if: [
                "needs.constants.outputs.is-fork-pr != 'true'",
                "github.event.pull_request.milestone == null"
            ].join(" && "),
            steps: [
                {
                    name: "Print latest Webiny version",
                    run: "echo ${{ needs.constants.outputs.latest-webiny-version }}"
                },
                {
                    id: "get-milestone-to-assign",
                    name: "Get milestone to assign",
                    run: runNodeScript(
                        "getMilestoneToAssign",
                        JSON.stringify({
                            latestWebinyVersion:
                                "${{ needs.constants.outputs.latest-webiny-version }}",
                            baseBranch: "${{ github.base_ref }}"
                        }),
                        { outputAs: "milestone" }
                    )
                },
                {
                    uses: "zoispag/action-assign-milestone@v1",
                    if: "steps.get-milestone-to-assign.outputs.milestone",
                    with: {
                        "repo-token": "${{ secrets.GH_TOKEN }}",
                        milestone: "${{ steps.get-milestone-to-assign.outputs.milestone }}"
                    }
                }
            ]
        }),
        build: createJob({
            name: "Build",
            needs: "constants",
            "runs-on": BUILD_PACKAGES_RUNNER,
            checkout: { path: DIR_WEBINY_JS },
            steps: [
                ...yarnCacheSteps,
                ...globalBuildCacheSteps,
                ...installBuildSteps,

                // Once we've built packages with the help of the global cache, we can now cache
                // the result for this run. All of the following jobs will use this cache.
                ...runBuildCacheSteps
            ]
        }),
        staticCodeAnalysis: createJob({
            needs: ["constants"],
            name: "Static code analysis",
            checkout: { path: DIR_WEBINY_JS },
            steps: [
                ...yarnCacheSteps,
                ...runBuildCacheSteps,
                ...withCommonParams(
                    [
                        { name: "Install dependencies", run: "yarn --immutable" },
                        { name: "Check code formatting", run: "yarn prettier:check" },
                        { name: "Check dependencies", run: "yarn adio" },
                        { name: "Check TS configs", run: "yarn check-ts-configs" },
                        { name: "ESLint", run: "yarn eslint" },
                        {
                            name: "Sync Dependencies Verification",
                            run: "yarn webiny verify-dependencies"
                        }
                    ],
                    { "working-directory": DIR_WEBINY_JS }
                )
            ]
        }),
        staticCodeAnalysisTs: createJob({
            name: "Static code analysis (TypeScript)",
            "runs-on": BUILD_PACKAGES_RUNNER,
            checkout: { path: DIR_WEBINY_JS },
            steps: [
                ...yarnCacheSteps,

                // We're not using run cache here. We want to build all packages
                // with TypeScript, to ensure there are no TypeScript errors.
                // ...runBuildCacheSteps,

                ...withCommonParams(
                    [
                        { name: "Install dependencies", run: "yarn --immutable" },
                        { name: "Build packages (full)", run: "yarn build" },
                        { name: "Check types for Cypress tests", run: "yarn cy:ts" }
                    ],
                    { "working-directory": DIR_WEBINY_JS }
                )
            ]
        }),
        ...createJestTestsJobs(null),
        ...createJestTestsJobs("ddb"),
        ...createJestTestsJobs("ddb-es"),
        ...createJestTestsJobs("ddb-os")
    }
});
