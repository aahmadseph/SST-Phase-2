/* eslint-disable class-methods-use-this */
import { writeFileSync } from 'fs';
import getAllFiles from '../DirectoryBrowser.mjs';
import PRIORITY_PAGES from '../priorityPagesList.mjs';

const JSX_EXT = '.jsx';
const BASE_DIR = process.cwd();
const PAGES_DIR = `${BASE_DIR}/src/pages`;

const getFileNames = () => {
    const filesInDir = getAllFiles(PAGES_DIR).filter(file => file.endsWith(JSX_EXT));

    return filesInDir.map(fullFilePath => {
        const shortFilePath = fullFilePath
            .split('pages')[1]
            .replace(/\\/g, '/')
            .replace(/^\//, '')
            .replace(/\.ctrlr\.jsx$/, '')
            .replace(/\.es6\.jsx$/, '')
            .replace(/\.f.jsx$/, '')
            .replace(/\.jsx$/, '')
            .replace(/\.r$/, '');
        const fileName = shortFilePath.split('/').reverse()[0];
        const fileNameExtender = shortFilePath.split('/').reverse()[1] || '';

        return {
            fileName: `${fileName}${fileNameExtender}`,
            shortFilePath
        };
    });
};

class PagesPlugin {
    constructor(options) {
        if (!options) {
            throw new Error('Argument "options" is required.');
        }

        this.options = options;
    }

    apply() {
        const files = getFileNames();

        // Separate files into priority and non-priority
        const priorityFiles = files.filter(({ shortFilePath }) => PRIORITY_PAGES.includes(shortFilePath));
        const nonPriorityFiles = files.filter(({ shortFilePath }) => !PRIORITY_PAGES.includes(shortFilePath));

        // Generate import statements and page lists for both priority and non-priority files
        const generateFileContent = fileList => {
            const imports = fileList.map(({ fileName, shortFilePath }) => `import ${fileName} from 'pages/${shortFilePath}';`);
            const pagesList = fileList.map(({ fileName, shortFilePath }) => `    '${shortFilePath}': ${fileName}`);

            return `/* eslint-disable comma-dangle */
${imports.join('\n')}

const pages = {
${pagesList.join(',\n')}
};

export default pages;
`;
        };

        // Generate content for pages/index.js
        const nonPriorityContent = generateFileContent(nonPriorityFiles);
        writeFileSync(`${BASE_DIR}/src/pages/index.js`, nonPriorityContent);

        // Generate content for pages/priorityIndex.js
        const priorityContent = generateFileContent(priorityFiles);
        writeFileSync(`${BASE_DIR}/src/pages/priorityIndex.js`, priorityContent);

        // Generate PageTemplates.js content that combines both priority and non-priority files
        let counter = 1;
        // Start with priority files to ensure they get lower (typically more important) numbers
        const allTemplatesList = [...priorityFiles, ...nonPriorityFiles].map(({ shortFilePath }) => `    '${shortFilePath}': ${counter++}`);

        const pageTemplates = `/* eslint-disable comma-dangle */
const PageTemplates = {
${allTemplatesList.join(',\n')}
};

module.exports = PageTemplates;
`;

        writeFileSync(`${BASE_DIR}/src/constants/PageTemplates.js`, pageTemplates);
    }
}

export default PagesPlugin;
