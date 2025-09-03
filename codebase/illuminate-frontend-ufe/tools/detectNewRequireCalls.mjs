/* eslint-disable no-console */
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import chalk from 'chalk';

// Change to the root directory where the git repository is located
const repoRoot = execSync('git rev-parse --show-toplevel').toString().trim();
process.chdir(repoRoot);

// Get the current branch name
const branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
const branchNameLower = branchName.toLowerCase();

// Check if the branch name contains 'automerge-fix' (case-insensitive) and skip the pre-commit check
if (branchNameLower.includes('automerge-fix')) {
    console.log(chalk.yellow('Skipping pre-commit check because branch name contains \'automerge-fix\''));
    process.exit(0);
}

// Function to check if a file contains a require() statement in the diff
function hasRequireInDiff(file) {
    const diff = execSync(`git diff --cached ${file}`).toString();

    // Split the diff output into lines and filter only the added lines (those starting with '+')
    const addedLines = diff.split('\n').filter(line => line.startsWith('+'));

    // Check if any of the added lines contain 'require('
    return addedLines.some(line => line.includes('require('));
}

// Exclusion criteria
const exclusions = [
    'githooks/pre-commit',
    'node_modules',
    'package-lock.json',
    'projects/server/src/libs/renderContent.mjs',
    'projects/server/src/services/apiRouter.mjs',
    'projects/server/src/services/router.mjs',
    'projects/server/src/template_child.mjs',
    'projects/server/tests',
    'projects/ui/__tests__/__mocks__/pageData',
    'projects/ui/config/babel/sephora-gql-plugin.js',
    'projects/ui/tests',
    'tools/detectNewRequireCalls.mjs',
    'projects/ui/thirdparty/braintree/venmo.min.js',
    'projects/ui/thirdparty/braintree/paypal.min.js',
    'projects/ui/thirdparty/braintree/client.min.js',
    'webpack'
];

// Function to check if a file is excluded
function isExcluded(file) {
    return exclusions.some(exclusion => file.includes(exclusion));
}

// Get the list of staged files
const allFiles = execSync('git diff --cached --name-only --diff-filter=ACMRTUXB').toString().split('\n').filter(Boolean);

// Group files by workspace
const workspaceFiles = allFiles.reduce((acc, file) => {
    const workspace = file.split('/')[1];

    if (!acc[workspace]) {
        acc[workspace] = [];
    }

    acc[workspace].push(file);

    return acc;
}, {});

let foundError = false;

Object.entries(workspaceFiles).forEach(([workspace, files]) => {
    files.forEach(file => {
        const absoluteFilePath = path.resolve(repoRoot, file);

        // Skip if the file is excluded or doesn't exist
        if (!fs.existsSync(absoluteFilePath)) {
            console.log(chalk.yellow(`File ${absoluteFilePath} not found. Skipping.\n`));
        } else if (isExcluded(file)) {
            console.log(chalk.cyan(`Skipping excluded file ${file} (excluded file or directory)\n`));
        } else if (hasRequireInDiff(file)) {
            console.log(chalk.red('----------------------------------------'));
            console.log(chalk.red(`ERROR in workspace:${workspace}: \nA new 'require()' statement found in ${file}`));
            console.log(chalk.yellow('Please use \'import\' instead of \'require\'. \n'));
            console.log(chalk.red('----------------------------------------'));
            foundError = true;
        }
    });
});

if (foundError) {
    process.exit(1);
} else {
    console.log(chalk.green('No new \'require()\' calls found in staged Git files.'));
    process.exit(0);
}
