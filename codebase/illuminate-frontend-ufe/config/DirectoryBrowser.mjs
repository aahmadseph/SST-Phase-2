import fs from 'fs';
import path from 'path';

function DirectoryBrowser(startDir) {
    function statFile(filename) {
        let results;
        try {
            results = fs.statSync(filename);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }

        return results;
    }

    function listDirectory(directory) {
        const result = [];
        try {
            const files = fs.readdirSync(directory);

            for (let i = 0, end = files.length; i < end; i++) {
                result.push(directory + '/' + files[i]);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }

        return result;
    }

    const results = [];

    function recurse(dir) {
        const resultData = listDirectory(dir);

        resultData.forEach(file => {
            const filename = path.resolve(dir, file);
            const stat = statFile(filename);

            if (stat.isDirectory()) {
                recurse(filename);
            } else if (stat.isFile()) {
                results.push(filename);
            }
        });
    }

    recurse(startDir);

    return results;
}

export default DirectoryBrowser;
