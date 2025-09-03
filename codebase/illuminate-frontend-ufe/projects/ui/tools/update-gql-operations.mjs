/* eslint-disable no-console */
import { runShellCommand } from './shell.mjs';
import fs from 'fs';
import path from 'path';

const REPO_WITH_QUERIES = path.resolve('../../../sephora-persisted-query-lists');
const ROOT_PATH = path.resolve('../../..');

async function cloneExternalRepo() {
    console.log('[GQL Generator] sephora-persisted-query-lists git repo does not exist.');
    console.log('[GQL Generator] Cloning git repo...');

    try {
        await runShellCommand(`cd ${ROOT_PATH} && git clone git@github.com:Sephora-US-Digital/sephora-persisted-query-lists.git`);
    } catch (exception) {
        if (fs.existsSync(REPO_WITH_QUERIES)) {
            console.log(await runShellCommand(`cd ${ROOT_PATH} && ls -la`));
            console.log('[GQL Generator] sephora-persisted-query-lists git repo was cloned successfully.');
        } else {
            throw new Error(exception);
        }
    }
}

async function getLatestForExternalRepo() {
    console.log(await runShellCommand(`cd ${REPO_WITH_QUERIES} && git pull`));
}

async function generateGqlMappings() {
    try {
        console.log('[GQL Generator] The generator started working.');

        // Check for presence of sephora-persisted-query-lists and clone git repo if not
        if (!fs.existsSync(REPO_WITH_QUERIES)) {
            await cloneExternalRepo();
        } else {
            // Update git repo if it was created before
            await getLatestForExternalRepo();
        }

        // Delete all existing gql files in src/constants/gql
        await runShellCommand('find src/constants/gql -type f -name "*.gql" -delete');
        // Copy all UFE gql files to UFE repo
        await runShellCommand(`rsync -avm --include='*.gql' --include='*/' --exclude='*' ${REPO_WITH_QUERIES}/ufe/gql/ src/constants/gql/`);
        console.log('[GQL Generator] UFE queries and mutations are updated.');
        // Copy all shared gql files to UFE repo
        await runShellCommand(`rsync -avm --include='*.gql' --include='*/' --exclude='*' ${REPO_WITH_QUERIES}/shared/gql/ src/constants/gql/`);
        console.log('[GQL Generator] Shared queries and mutations are updated.');
        // Copy UFE manifest to UFE repo
        await runShellCommand(`cp -rf ${REPO_WITH_QUERIES}/rootManifests/ufe-client-persisted-query-manifest.json src/constants/gql/manifest.json`);
        console.log('[GQL Generator] Manifest is updated.');
        console.log('[GQL Generator] The generator finished working.');
    } catch (error) {
        console.error('Error generating GQL mappings:', error);
    }
}

generateGqlMappings();
