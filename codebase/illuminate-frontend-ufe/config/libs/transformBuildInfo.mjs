function transformBuildInfo(content, fpath) {
    // add our custom code to at.js
    let results = content;

    if (/\/buildInfo.json$/.test(fpath)) {
        const jsondata = JSON.parse(content);
        const datetime = Date.parse(jsondata['BUILD_DATE']);
        results = `${jsondata['BUILD_NUMBER']}-${jsondata['GIT_COMMIT']}-${datetime}`;
    }

    return results;
}

export default transformBuildInfo;
