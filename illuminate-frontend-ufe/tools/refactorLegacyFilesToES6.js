/* eslint-disable no-console */
const fs = require('fs');
const util = require('util');
const readline = require('readline');

// Promisifications
const readdirP = util.promisify(fs.readdir);
const statP = util.promisify(fs.stat);

const LC_NAMES = [
    'render',
    'componentDidMount',
    'shouldComponentUpdate',
    'getDerivedStateFromProps',
    'constructor',
    'getSnapshotBeforeUpdate',
    'componentDidUpdate',
    'componentWillUpdate',
    'componentWillReceiveProps',
    'UNSAFE_componentWillUpdate',
    'UNSAFE_componentWillReceiveProps',
    'UNSAFE_componentWillMount',
    'componentWillMount',
    'componentWillUnmount',
    'getDerivedStateFromError',
    'componentDidCatch'
];

const UFE_JS_FOLDER = __dirname + '/../projects/ui/src';

// Script initialization
const firstOnly = process.argv.includes('--first') || process.argv.includes('-f');
const keepSources = process.argv.includes('--keep-sources') || process.argv.includes('-k');
const verbose = process.argv.includes('--verbose') || process.argv.includes('-v');
const plain = process.argv.includes('--plain') || process.argv.includes('-p');
const directoryIndex = process.argv.indexOf('--dir');

// Verbose logger
const chunter = verbose ? console.log : () => null;

// Get a relative directory from the arguments or keep it as a JS root
let directory = '/';

if (directoryIndex !== -1) {
    directory = process.argv[directoryIndex + 1];
}

const fullPath = UFE_JS_FOLDER + directory;

chunter(`
-----------------------
Received configurations:

First entry only: ${firstOnly}
Keep sources: ${keepSources}
Plain mode: ${plain}
Verbose mode: ${verbose}
Directory: ${directory}

Full path to work with: ${fullPath}
-----------------------
`);

// Show help
if (process.argv[2] === 'help') {
    console.info(`
    You are using a semi-automatic tool to convert legacy *.c.js/*.jsx files to the *.es6.jsx or *.ctrlr.jsx components.
    Please note, this script WILL NOT convert components completely, you will have to make it manually.
    The script merges controller file and a component file, makes a class notation and exports.
    
    Known points:
    * Make sure you're using class attributes for methods (except LC hooks) to not loose a context binding
    * Make sure you don't have any duplicated imports
    
    Options:
    --first | -f               -    Convert just first entry
    --keep-sources | -k        -    Keep source files
    --plain | -p               -    Plain mode - do not scan folders recursively
    --verbose | -v             -    Verbose mode
    --dir                      -    A directory to convert. Should start with '/' and be relative to 'ufe/projects/ui/src' folder
`);
    process.exit(0);
}

/**
 * Flat an array recursively
 * @param {any[]} array not flattened array
 * @returns {any[]} flattened array
 */
const deepFlatten = array =>
    array.reduce((acc, e) => {
        if (Array.isArray(e)) {
            acc.push(...deepFlatten(e));
        } else {
            acc.push(e);
        }

        return acc;
    }, []);

/**
 * Checks if file exists
 * @param {string} filePath an absolute file path
 * @return {Promise<boolean>} is file eixst
 */
const isFileExist = filePath =>
    new Promise(res => {
        fs.access(filePath, fs.F_OK, err => res(!err));
    });

/**
 * Delete a file by an absolute path
 * @param {string} filePath - an absolute file path
 * @return {Promise<string | Error>} either removed file path or error
 */
const deleteFile = filePath =>
    new Promise((res, rej) => {
        fs.unlink(filePath, err => {
            if (err) {
                rej(err);
            } else {
                res(filePath);
            }
        });
    });

/**
 * Get a shape with component name and path and the component's controller path if exists
 * @param {string} componentPath a path of the controller
 * @return {Promise<{componentName: string, componentPath: string, componentFolder: string, controllerPath: (string | null)}>} resulted shape
 */
const getComponentPathWithController = componentPath =>
    new Promise(res => {
        const splitPath = componentPath.split('/');
        const [componentName] = splitPath.pop().split('.');
        const controllerName = `${componentName}.c.js`;
        const componentFolder = splitPath.join('/');
        const controllerPath = `${componentFolder}/${controllerName}`;

        isFileExist(controllerPath).then(isExist => {
            res({
                componentFolder: splitPath.join('/'),
                componentName,
                componentPath,
                controllerPath: isExist ? controllerPath : null
            });
        });
    });

/**
 * Scan a folder recursively to collect all [Name].jsx files paths
 * @param {string} entryFolder scan folder
 * @param {boolean} plainMode do not scan folders recursively
 * @returns {Promise<string[]>} an array of all [Name].jsx files paths
 */
const getAllJSXComponents = (entryFolder, plainMode = false) => {
    return readdirP(entryFolder)
        .then(files =>
            Promise.all(
                files.sort().map(fileName => {
                    const filePath = `${entryFolder}/${fileName}`;

                    return statP(filePath).then(stats => ({
                        fileName,
                        filePath,
                        stats
                    }));
                })
            )
        )
        .then(filesWithStats =>
            Promise.all(
                filesWithStats.reduce((acc, file) => {
                    if (/^[a-zA-Z0-9]+\.jsx$/.test(file.fileName)) {
                        acc.push(Promise.resolve(file.filePath));

                        return acc;
                    }

                    if (file.stats.isDirectory() && !plainMode) {
                        acc.push(getAllJSXComponents(file.filePath));

                        return acc;
                    }

                    return acc;
                }, [])
            )
        )
        .then(deepFlatten);
};

/**
 * Read a file line by line and return an array of those lines
 * @param {string} filePath - an absolute file path
 * @return {Promise<string>} an array of lines from the file
 */
const getFileAsLinesArray = filePath =>
    new Promise(res => {
        const content = [];

        readline
            .createInterface({
                input: fs.createReadStream(filePath),
                console: false
            })
            .on('line', function (line) {
                content.push(line);
            })
            .on('close', () => {
                res(content);
            });
    });

/**
 * Add merged controller and component content separated by a comment string as a lines array to the current comopnents info
 * @param {{componentName: string, componentPath: string, componentFolder: string, controllerPath: (string | null)}} componentInfo - current component info
 * @return {Promise<{componentName: string, componentPath: string, componentFolder: string, controllerPath: (string | null), lines: string[]}>} component info with merged lines
 */
const getCombinedFilesArray = componentInfo => {
    const hasCtrlr = Boolean(componentInfo.controllerPath);

    const componentLinesPromise = getFileAsLinesArray(componentInfo.componentPath);
    const controllerLinesPromise = hasCtrlr ? getFileAsLinesArray(componentInfo.controllerPath) : Promise.resolve([]);

    return Promise.all([componentLinesPromise, controllerLinesPromise])
        .then(([componentLines, controllerLines]) => [...componentLines, '', '// _____CONTROLLER BELOW____', '', ...controllerLines])
        .then(lines => ({
            ...componentInfo,
            lines
        }));
};

/**
 * Convert a component info and merged lines to the class file, save this file and remove sources
 * @param {{componentName: string, componentPath: string, componentFolder: string, controllerPath: (string | null), lines: string[]}} componentInfo component info with merged lines array
 * @return {Promise<undefined>} resolves if passed
 */
const processComponentInfo = componentInfo =>
    new Promise((res, rej) => {
        const hasCtrlr = Boolean(componentInfo.controllerPath);

        const { lines, componentName } = componentInfo;

        let initialImportPassed = false;
        const modifiedLines = lines.reduce(
            (acc, line, i, self) => {
                if (!initialImportPassed && (!line.trim() || line.includes('require'))) {
                    acc.push(line);

                    return acc;
                }

                if (line.includes(`${componentName}.prototype.`)) {
                    if (!initialImportPassed) {
                        initialImportPassed = true;
                        acc.push(`class ${componentName} extends BaseClass {`);
                    }

                    let nextLine = line.replace(`${componentName}.prototype.`, '');

                    if (nextLine.includes('ctrlr')) {
                        nextLine = nextLine.replace('ctrlr', 'componentDidMount');
                    }

                    if (LC_NAMES.some(name => nextLine.includes(name))) {
                        nextLine = nextLine.replace(/\=\s?function/, '');
                    } else {
                        nextLine = nextLine.replace(/\=\s?function/, '=').replace('{', '=> {');
                    }

                    acc.push(nextLine);

                    return acc;
                }

                acc.push(line);

                if (i === self.length - 1) {
                    acc.push('}', '', `module.exports = wrapComponent(${componentName}, '${componentName}', ${hasCtrlr});`, '');
                }

                return acc;
            },
            [
                '/* eslint-disable class-methods-use-this */',
                'const React = require(\'react\');',
                '',
                'const BaseClass = require(\'components/BaseClass/BaseClass\');',
                'const { wrapComponent } = require(\'utils/framework\');'
            ]
        );

        const filePath = `${componentInfo.componentFolder}/${componentInfo.componentName}.${hasCtrlr ? 'ctrlr' : 'es6'}.jsx`;
        fs.writeFile(filePath, modifiedLines.join('\n'), err => {
            if (err) {
                rej(err);

                return;
            }

            chunter(`${filePath} has been saved`);

            // Delete source files after the file is saved
            if (!keepSources) {
                Promise.all([deleteFile(componentInfo.componentPath), ...(hasCtrlr ? [deleteFile(componentInfo.controllerPath)] : [])]).then(
                    paths => {
                        chunter(`Source files were removed: ${paths}`);
                        res();
                    }
                );
            } else {
                res();
            }
        });
    });

// Get a list of all components
chunter(`Start collecting components in ${fullPath} ${!plain ? 'recursively' : ''}`);

if (verbose) {
    console.time('process');
}

getAllJSXComponents(fullPath, plain)
    .then(componentPaths => {
        chunter(`Components found in the project: ${componentPaths.length}`);

        if (verbose) {
            console.timeLog('process', 'getAllJSXComponents');
        }

        if (componentPaths.length === 0 || !firstOnly) {
            return componentPaths;
        }

        chunter('The first component will be converted');

        return [componentPaths[0]];
    })
    // Add controller paths and component names
    .then(componentPaths => {
        chunter('Start collecting controllers paths');

        return Promise.all(componentPaths.map(getComponentPathWithController));
    })
    .then(componentInfos => {
        chunter('Start reading components and controllers content and merge them in a single array');

        if (verbose) {
            console.timeLog('process', 'getComponentPathWithController');
        }

        return Promise.all(componentInfos.map(getCombinedFilesArray));
    })
    .then(data => {
        chunter('Start processing collected components');

        if (verbose) {
            console.timeLog('process', 'getCombinedFilesArray');
        }

        return Promise.all(data.map(processComponentInfo));
    })
    .then(results => {
        chunter(`${results.length} have been converted`);

        if (verbose) {
            console.timeEnd('process');
        }
    });
