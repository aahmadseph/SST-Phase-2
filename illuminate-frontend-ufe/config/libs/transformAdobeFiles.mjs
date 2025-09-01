import fs from 'fs';
import path from 'path';

/*
 ** Adds our custom code to at.js and VisitorAPI.js scripts without modifying the original source
 */
function transformAdobeFiles(content, fpath) {
    // add our custom code to at.js
    let results = content;

    if (/\/at.js$/.test(fpath)) {
        const targetHeader = path.resolve('../ui/src/services/TestTarget/testTargetHeader.js');
        const targetFooter = path.resolve('../ui/src/services/TestTarget/testTargetFooter.js');
        const testTargetHeader = fs.readFileSync(targetHeader).toString();
        const testTargetFooter = fs.readFileSync(targetFooter).toString();

        results = testTargetHeader + content + testTargetFooter;
    } else if (/\/VisitorAPI.js$/.test(fpath)) {
        const footerPath = path.resolve('../ui/src/services/TestTarget/visitorAPIFooter.js');
        const visitorAPIFooter = fs.readFileSync(footerPath).toString();

        results = content + visitorAPIFooter;
    }

    return results;
}

export default transformAdobeFiles;
