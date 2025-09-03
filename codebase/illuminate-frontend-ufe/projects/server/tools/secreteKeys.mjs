/* eslint no-console: 0 */
import {
    generateKeyPairSync, privateEncrypt, publicDecrypt
} from 'node:crypto';
import fs from 'node:fs';
import { exit } from 'node:process';

import { getEnvProp } from '#server/utils/serverUtils.mjs';

// Get the directory name of the current module
const baseDir = getEnvProp('SERVER_HOME');
if (!baseDir) {
    console.error(`SERVER_HOME is not set, please set this before running this script!`);
    exit(-1);
}

const INPUT_FILE_TO_ENCRYPT = `${baseDir}/tools/runProfiles/decrypted.sh`;
const FILE_TO_DECRYPT = `${baseDir}/tools/runProfiles/encrypted.dat`;
const PUBLIC_KEY_FILE = `${baseDir}/tools/runProfiles/public.key`;

// arguments
const args = process.argv;

if (args.length > 2 && args[2] === '--encrypt') {
    const keyPair = generateKeyPairSync('rsa', {
        modulusLength: 8192,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    });
    fs.writeFileSync(PUBLIC_KEY_FILE, keyPair.publicKey, {});

    fs.readFile(INPUT_FILE_TO_ENCRYPT, (err, data) => {
        if (err) {
            console.error(err);

            return;
        }

        const filedata = data.toString();
        const encrypted = privateEncrypt(keyPair.privateKey, Buffer.from(filedata, 'utf8')).toString('base64');
        fs.writeFileSync(FILE_TO_DECRYPT, encrypted);
    });
} else {
    fs.readFile(PUBLIC_KEY_FILE, (serr, kdata) => {
        if (serr) {
            console.error(serr);

            return;
        }

        fs.readFile(FILE_TO_DECRYPT, (err, data) => {
            if (err) {
                console.error(err);

                return;
            }

            const encrypted = Buffer.from(data.toString(), 'base64');
            const decrypted = publicDecrypt(kdata.toString(), encrypted);
            fs.writeFileSync(`${baseDir}/tools/runProfiles/decrypted.sh`, decrypted);
        });
    });
}
