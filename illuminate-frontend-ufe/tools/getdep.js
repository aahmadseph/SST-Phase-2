// return a list of all component dependencies for a component
//  run from `projects/ui/src` folder as command line tool:
//------------------------------------------------------------------------------
// node ../../tools/getdep.js components/OrderConfirmation/OrderConfirmation
//------------------------------------------------------------------------------

const fs = require('fs');

/**
 * returns list of matches to passed regexp in a string
 * @param {*} string string for a search
 * @param {*} regex
 * @param {*} index
 */
const getMatches = (string, regex, index = 1) => {
    const matches = [];
    let match;

    while ((match = regex.exec(string))) {
        matches.push(match[index]);
    }

    return matches;
};

/**
 * saves mantched dependencies recursively
 * @param {*} param0 an obect
 */
const getDependencyListAndAddToSet = ({ paths, regex, dict, getFullPath }) => {
    paths.forEach(path => {
        const fullpath = getFullPath(path);

        if (!dict.has(path) && fullpath) {
            dict.add(path);

            const content = fs.readFileSync(fullpath, 'utf8');
            getDependencyListAndAddToSet({
                paths: getMatches(content, regex),
                regex,
                dict,
                getFullPath
            });
        }
    });
};

/**
 * main function
 */
const main = () => {
    const rootComponentRelativePath = process.argv[2]; // 'components/OrderConfirmation/OrderConfirmation'

    const components = new Set();
    getDependencyListAndAddToSet({
        paths: [rootComponentRelativePath],
        regex: /require\('(components\/.+)'\)/g,
        dict: components,
        // getFullPath is different for diff deps e.g. may be .js or .jsx
        // or another folder/filename convention
        getFullPath: path => {
            const full = path + /*'/' + path.split('/').pop() +*/ '.jsx';

            return fs.existsSync(full) ? full : null;
        }
    });

    // console.log(components);
    components.forEach(component => process.stdout.write(component + '\n'));
};

// start
main();
