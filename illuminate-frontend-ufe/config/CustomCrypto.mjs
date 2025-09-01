import fs from 'fs';
import path from 'path';
import { getEnvProp } from '../projects/server/src/utils/serverUtils.mjs';
import printTimestamp from '../projects/ui/src/utils/Timestamp.js';

const reformat = /\:|\ |\,|\-|\.|\_|\//g;

// Get the directory name of the current module
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Determine the root directory of the monorepo
const rootDir = path.resolve(__dirname, '../');

// Resolve the path to buildInfo.json
const buildInfoPath = path.join(rootDir, 'projects/server/src/config/buildInfo.json');
const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf-8'));
const BUILD_MODE = getEnvProp('BUILD_MODE', 'isomorphic');
const isFrontEnd = BUILD_MODE === 'frontend';
const BUILD_NUMBER = `B${buildInfo.BUILD_NUMBER}`.replace('-docker', '').replace('-node.js', '').replace(reformat, '');
const CODE_BRANCH = `C${buildInfo.CODE_BRANCH}`.replace('-docker', '').replace('Unknown-', '').replace(reformat, '');

function getTimestamp() {
    return (
        'D' +
        printTimestamp()
            .replace(reformat, '')
            .substring(0, CODE_BRANCH === 'CBLocal' ? 8 : 14)
    );
}

class CustomCrypto {
    constructor() {
        this.now = `${BUILD_NUMBER}${CODE_BRANCH}${isFrontEnd ? '' : getTimestamp()}`;
    }

    createHash() {
        this.now = `${BUILD_NUMBER}${CODE_BRANCH}${isFrontEnd ? '' : getTimestamp()}`;

        return this;
    }

    update() {
        return this;
    }

    digest() {
        return this.now;
    }
}

export default CustomCrypto;
