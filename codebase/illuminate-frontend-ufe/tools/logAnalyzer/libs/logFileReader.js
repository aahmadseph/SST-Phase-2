const fs = require('fs'),
    readline = require('readline');

const baseDir = `${process.cwd()}/tools/logAnalyzer/`,
    { greaterThanEqualDate, lessThanThanEqualDate, greaterThanEqualTime, lessThanEqualTime, parseDateTime } = require(`${baseDir}/libs/dateUtils`),
    { convertPathToHostIP } = require(`${baseDir}/libs/fileUtils`);

const PARSED_LINE_RE = /(\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d,\d\d\d) - ([a-zA-Z0-9]*.js) - ([a-zA-Z]*:) ([a-zA-Z\w\W]*)/;

async function logFileReader(logFilename, options = {}) {
    const matchStr = options.matchStr || '*',
        filterDateStart = options.startDate,
        filterDateEnd = options.endDate,
        filterTimeStart = options.startTime,
        filterTimeEnd = options.endTime;

    return new Promise(resolve => {
        const hostIP = convertPathToHostIP(logFilename);
        const readStream = fs.createReadStream(logFilename);
        const rl = readline.createInterface({ input: readStream });

        const resultSet = [];
        const regexMatchStr = new RegExp(matchStr.trim().replace(/\*/g, '[\\w|\\W]*'));
        rl.on('line', line => {
            let saveLine = false;

            if (line.match(regexMatchStr)) {
                saveLine = true;
            }

            if (filterDateStart) {
                saveLine = saveLine && greaterThanEqualDate(line, filterDateStart);
            }

            if (filterDateEnd) {
                saveLine = saveLine && lessThanThanEqualDate(line, filterDateEnd);
            }

            if (filterTimeStart) {
                saveLine = saveLine && greaterThanEqualTime(line, filterTimeStart);
            }

            if (filterTimeEnd) {
                saveLine = saveLine && lessThanEqualTime(line, filterTimeEnd);
            }

            if (saveLine) {
                const datetime = parseDateTime(line) || [];
                const parseOutLine = line.match(PARSED_LINE_RE);
                const results = {
                    hostIP,
                    line
                };

                if (parseOutLine) {
                    results['filename'] = parseOutLine[2];
                    results['logLevel'] = parseOutLine[3];
                    results['message'] = parseOutLine[4];

                    if (parseOutLine[4]) {
                        results['lineBits'] = parseOutLine[4].split(/ /);
                        results['lineBits'].unshift(results['logLevel']);
                        results['lineBits'].unshift(results['filename']);
                        results['lineBits'].unshift(datetime[0]);
                    }
                }

                resultSet.push({ [datetime[0]]: results });
            }
        });

        rl.on('close', () => {
            return resolve(resultSet);
        });
    });
}

module.exports = logFileReader;
