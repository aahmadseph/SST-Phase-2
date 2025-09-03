import { dirname, basename } from 'path';
import { writeFileSync } from 'fs';
import getAllFiles from '../DirectoryBrowser.mjs';

const RESOURCE_POSTFIX = /(.*)_en_US/;
const LOCALIZATION_RESOURCES = /(.*)_en_US|(.*)_fr_CA/;
const BASE_FOLDER_REGEX = /(.*\/src\/)(ai|actions|analytics|constants|components|pages|services|utils|Index)(.*)/;
const BASE_DIR = process.cwd();
let resourceFilesAreUpdated = false;

class LocalizationPlugin {
    constructor(options) {
        if (!options) {
            throw new Error('Argument "options" is required.');
        }

        this.options = options;
    }

    apply() {
        if (resourceFilesAreUpdated) {
            return;
        }

        resourceFilesAreUpdated = true;
        let localization = `/* eslint-disable comma-dangle */
const localization = {`;
        const resourceFiles = [];
        const allFiles = getAllFiles(BASE_DIR + '/src');

        allFiles.forEach(file => {
            const name = basename(file, '.js');
            const path = LocalizationPlugin.getRelativePath(file);

            if (LOCALIZATION_RESOURCES.test(name)) {
                localization += `
    '${path}/${name}': require('${file}'),`;
            }

            if (this.options.test) {
                if (RESOURCE_POSTFIX.test(name)) {
                    resourceFiles.push({
                        name: name.replace(/_en_US/, ''),
                        path,
                        languages: ['en', 'fr']
                    });
                }
            }
        });

        localization += `
};

module.exports = localization;
`;

        writeFileSync(`${BASE_DIR}/src/utils/locales/allResources.js`, localization);

        if (this.options.test) {
            writeFileSync(`${BASE_DIR}/tests/spec/locales/ResourceList.js`, `module.exports = ${JSON.stringify(resourceFiles)};`);
        }
    }

    static getRelativePath = file => {
        const fullPath = dirname(file);
        const pathParts = fullPath.replace(BASE_FOLDER_REGEX, function () {
            const mainFolder = arguments[2];
            const restOfPath = arguments[3];
            const newPath = mainFolder + restOfPath;

            return newPath;
        });

        return pathParts;
    };
}

export default LocalizationPlugin;
