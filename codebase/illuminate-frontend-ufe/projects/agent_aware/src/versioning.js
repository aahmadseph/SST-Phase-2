/* eslint-disable no-console */
const fs = require('fs/promises');

const MANIFEST_FILE = './chrome-extension/manifest.json';
const manifestJson = require(MANIFEST_FILE);

const pReadFile = fs.readFile;
const pWriteFile = fs.writeFile;

const { version } = manifestJson;

const [, , forceVersion] = process.argv;

const nextVersion = (() => {
    if (forceVersion) {
        return forceVersion;
    }

    const [maj, min, fix] = version.split('.');

    return `${maj}.${min}.${fix ? Number.parseInt(fix, 10) + 1 : '1'}`;
})();

const saveChanges = filename => content => pWriteFile(filename, content, { encoding: 'utf-8' });

const manifestFile = pReadFile(MANIFEST_FILE, { flag: 'r+', encoding: 'utf-8' })
    .then(content => {
        const regex = new RegExp(`"version":\\s"${version}",`);

        return content.replace(regex, `"version": "${nextVersion}",`);
    })
    .then(saveChanges(MANIFEST_FILE));

Promise.all([manifestFile])
    .then(() => console.info('Update completed'))
    .catch(e => console.error('Can not bump a version', e));
