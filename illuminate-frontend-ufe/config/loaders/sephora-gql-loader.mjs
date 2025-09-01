import { generatePersistedQueryManifest } from '@apollo/generate-persisted-query-manifest';
import { readFile } from 'fs/promises';
import path from 'path';

let manifest = null;

async function sephoraGQLLoader() {
    if (!manifest) {
        manifest = {};
        const filePath = path.resolve('src/constants/gql/manifest.json');
        const manifestJSON = await readFile(filePath, 'utf8');
        const originalManifest = JSON.parse(manifestJSON);
        originalManifest.operations.forEach(operation => {
            manifest[operation.id] = operation.name;
        });
        // eslint-disable-next-line no-console
        console.log(manifest);
    }

    const manifestConfig = { documents: this.resourcePath };
    const { operations } = await generatePersistedQueryManifest(manifestConfig);
    const [{ id: queryId, name: queryName }] = operations;

    if (manifest[queryId] !== queryName) {
        throw new Error(`Query "${queryName}" with id "${queryId}" not found in manifest`);
    }

    return `export const ${queryName} = "${queryId}";`;
}

export default sephoraGQLLoader;
