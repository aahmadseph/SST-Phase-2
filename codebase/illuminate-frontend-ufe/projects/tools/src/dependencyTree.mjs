/* eslint no-console: 0 */
import fs from 'node:fs';
import process from 'node:process';

import { parse } from 'espree';
import estraverse from 'estraverse';

const baseDir = process.cwd();

const readFile = fs.readFileSync;

const processedMap = {};

let inputFilename,
    moduleType = 'module',
    depth = 5,
    projectPath,
    verbose = false;

function getArgs() {
    let hasFilename = false;
    const args = process.argv;

    for (let i = 2, end = process.argv.length; i < end; i++) {
        if (args[i].startsWith('--filename') && args[i + 1]) {
            inputFilename = args[i + 1];
            hasFilename = true;
            const parts = inputFilename.split(/\//g);
            projectPath = `${parts[0]}/${parts[1]}`;
            i++;
        } else if (args[i].startsWith('--depth') && args[i + 1]) {
            depth = args[i + 1];
            i++;
        } else if (args[i].startsWith('--moduleType') && args[i + 1]) {
            moduleType = args[i + 1];
            i++;
        } else if (args[i].startsWith('--verbose') && args[i + 1]) {
            verbose = args[i + 1];
            i++;
        }
    }

    return hasFilename;
}

if (!getArgs()) {
    console.error('Needs at least --filename passed');
    console.error('USAGE:');
    console.error('node projects/tools/src/dependencyTree.mjs --filename [filename to see tree]');
    console.error('node projects/tools/src/dependencyTree.mjs --filename [filename to see tree] --depth [depth default 10]');
    console.error('node projects/tools/src/dependencyTree.mjs --filename [filename to see tree] --depth [depth default 10]');
    process.exit(-1);
}

function fileExists(file) {
    try {
        const stats = fs.statSync(file);

        return stats;
    } catch (e) {
        return false;
    }
}

function getFilename(projectSrcHome, value) {
    const serverFileName = value.startsWith('#server') ? value.replace('#server', projectSrcHome) : '';
    const fullFilename = `${projectSrcHome}/${value}`;

    const extFilenames = ['.es6.jsx', '.ctrlr.jsx', '.jsx', '.js'].map(ext => `${projectSrcHome}/${value}${ext}`);

    const filelist = [serverFileName, fullFilename, ...extFilenames]
        .map(filename => {
            return {
                filename: filename,
                stats: fileExists(filename)
            };
        })
        .filter(item => {
            return item.stats;
        });

    if (!filelist || filelist.length === 0 || !filelist[0]) {
        return undefined;
    }

    return filelist[0].stats?.isDirectory() ? `${filelist[0].filename}/index.js` : filelist[0].filename;
}

function findNode(node, type, handler) {
    estraverse.traverse(node, {
        enter: function (cnode, _parent) {
            if (cnode.type === type) {
                handler(cnode);
            }
        },
        fallback: 'iteration'
    });
}

function processFile(filename, _level) {
    const fileData = readFile(filename);
    const options = {
        ecmaVersion: 15
    };

    options.sourceType = moduleType;
    options.ecmaFeatures = {
        jsx: true
    };

    const tree = parse(fileData.toString(), options);

    return tree;
}

function walkTree(tree, level) {
    findNode(tree, 'ImportDeclaration', node => {
        const value = node.source.value;
        const projectSrcHome = `${baseDir}/${projectPath}/src`;

        if (projectPath.includes('projects/server') || projectPath.includes('projects/ui')) {
            const filename = value.startsWith('#server') ? value.replace('#server', projectSrcHome) : getFilename(projectSrcHome, value);

            if (filename) {
                const fileExtension = filename.substring(filename.lastIndexOf('.'));

                if (!processedMap[`${filename}-${level}`]) {
                    processedMap[`${filename}-${level}`] = filename;
                    console.log('-'.repeat(level), `projects${filename.split('projects')[1]}`);
                }

                if (!['.gql'].includes(fileExtension)) {
                    const nextLevel = level + 1;

                    if (depth === -1 || depth >= nextLevel) {
                        const itree = processFile(filename);
                        walkTree(itree, nextLevel);
                    }
                }
            } else if (verbose) {
                // skip node modules and node_modules
                console.log(`Not found, jsx, or directory: ${value}`);
            }
        } else if (verbose) {
            // skip node modules and node_modules
            console.log(`Not found: ${value}`);
        }
    });
}

function main(file) {
    const filename = `${baseDir}/${file}`;
    const tree = processFile(filename);
    console.log(`Using project path ${projectPath}`);
    console.log(`Starting with file: ${file}`);
    walkTree(tree, 1);
}

main(inputFilename);
