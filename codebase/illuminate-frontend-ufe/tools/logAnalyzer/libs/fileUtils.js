const fs = require('fs'),
    { promisify } = require('util');

const baseDir = `${process.cwd()}/tools/logAnalyzer/`,
    { UFE_HOME, BASE_LOG_DIR } = require(`${baseDir}/libs/Constants`);

function getLogFileDir(logHost) {
    return `${BASE_LOG_DIR}/${logHost.replace(/\./g, '_')}`;
}

function getLogfilename(logUrl) {
    return logUrl.substring(logUrl.lastIndexOf('/'));
}

function getJERRILogfilename(logHost, logUrl = '/logs/ufe/node_jerri.log') {
    return `${getLogFileDir(logHost)}${getLogfilename(logUrl)}`;
}

const fsReadFile = promisify(fs.readFile);

const API_HOST_STR = 'API_HOST=';

async function getEnvHost(envHost) {
    const filedata = (await fsReadFile(`${UFE_HOME}/tools/runProfiles/azr-${envHost}.profile.sh`)).toString();

    let logHost = filedata.substring(filedata.indexOf(API_HOST_STR));
    logHost = logHost.substring(API_HOST_STR.length, logHost.indexOf('export'));

    return logHost.trim();
}

function convertPathToHostIP(logFilename) {
    let hostIP = logFilename;
    try {
        hostIP = logFilename.split('logs/')[1].split('/')[0].replace(/\_/g, '.');
    } catch (e) {
        // do nothing
    }

    return hostIP;
}

module.exports = {
    getLogFileDir,
    getLogfilename,
    getJERRILogfilename,
    getEnvHost,
    convertPathToHostIP
};
