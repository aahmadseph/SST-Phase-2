/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
//
// Before running script do not forget to:
// 1. update Node version in .nvmrc file to 16.15.1
// 2. npm install --save-dev prettier-eslint --save-exact
//
const fs = require('fs');
const format = require('prettier-eslint');
const prettierOptions = require('../prettier.config.js');

const srcFolder = `${__dirname}/../../tests/spec`;
const foldersToSkip = [srcFolder + '/build', srcFolder + '/buildtools', srcFolder + '/thirdparty'];

const reformatFiles = async path => {
    const fsEntries = fs.readdirSync(path);

    for (const fsEntry of fsEntries) {
        const fsEntryPath = path + '/' + fsEntry;

        if (fs.statSync(fsEntryPath).isDirectory()) {
            if (!foldersToSkip.includes(fsEntryPath)) {
                await reformatFiles(fsEntryPath);
            }
        } else {
            const filePath = fsEntryPath;
            const isLocaleFile = filePath.endsWith('_en_US.js') || filePath.endsWith('_fr_CA.js');
            const allowFileToReformat = filePath.endsWith('.jsx') || (filePath.endsWith('.js') && !isLocaleFile);

            if (allowFileToReformat) {
                try {
                    const options = {
                        filePath,
                        prettierOptions
                    };
                    const fileText = await format(options);
                    fs.writeFileSync(filePath, fileText);
                    console.log(filePath);
                } catch (error) {
                    console.log('');
                    console.error(error);
                    console.log('');
                }
            }
        }
    }
};

reformatFiles(srcFolder);
