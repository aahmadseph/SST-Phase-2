import { generatePersistedQueryManifest } from '@apollo/generate-persisted-query-manifest';
import fs from 'fs';
import path from 'path';

function getGqlFilePaths(dir, gqlFiles = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);

        if (fs.statSync(filePath).isDirectory()) {
            getGqlFilePaths(filePath, gqlFiles);
        } else if (filePath.endsWith('.gql')) {
            gqlFiles.push(filePath);
        }
    });

    return gqlFiles;
}

async function buildManifest(gqlFiles) {
    const manifest = {};

    for await (const filePath of gqlFiles) {
        const manifestConfig = { documents: filePath };
        const { operations } = await generatePersistedQueryManifest(manifestConfig);
        const srcDir = filePath?.split('projects/ui/src/')[1];
        manifest[srcDir] = operations[0];
    }

    return manifest;
}

async function createGqlFilesToManifestMapping() {
    const gqlQueriesFiles = getGqlFilePaths(path.resolve('src/constants/gql/queries'));
    const gqlMutationsFiles = getGqlFilePaths(path.resolve('src/constants/gql/mutations'));
    const gqlFiles = [...gqlQueriesFiles, ...gqlMutationsFiles];

    const manifest = await buildManifest(gqlFiles);
    fs.writeFileSync(path.resolve('config/babel/sephora-gql-plugin-config.json'), JSON.stringify(manifest));
}

export { createGqlFilesToManifestMapping };
