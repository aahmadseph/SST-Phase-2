// date functions

function parseDateTime(inStr) {
    return inStr.match(/^\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d,\d\d\d/);
}

function greaterThanEqualDate(inStr, checkDate) {
    let match = false;
    const lineDate = parseDateTime(inStr);

    if (lineDate) {
        const cdate = lineDate[0].replace(/-/g, '').split(' ')[0];
        const compareDate = checkDate.replace(/-/g, '');

        if (cdate >= compareDate) {
            match = true;
        }
    }

    return match;
}

function lessThanThanEqualDate(inStr, checkDate) {
    let match = false;
    const lineDate = parseDateTime(inStr);

    if (lineDate) {
        const cdate = lineDate[0].replace(/-/g, '').split(' ')[0];
        const compareDate = checkDate.replace(/-/g, '');

        if (cdate <= compareDate) {
            match = true;
        }
    }

    return match;
}

function greaterThanEqualTime(inStr, checkTime) {
    let match = false;
    const linedata = parseDateTime(inStr);

    if (linedata) {
        const ctime = linedata[0].split(' ')[1].split(',')[0].replace(/:/g, '');
        const compareTime = checkTime.replace(/:/g, '');

        if (ctime >= compareTime) {
            match = true;
        }
    }

    return match;
}

function lessThanEqualTime(inStr, checkTime) {
    let match = false;
    const linedata = parseDateTime(inStr);

    if (linedata) {
        const ctime = linedata[0].split(' ')[1].split(',')[0].replace(/:/g, '');
        const compareTime = checkTime.replace(/:/g, '');

        if (ctime <= compareTime) {
            match = true;
        }
    }

    return match;
}

module.exports = {
    parseDateTime,
    greaterThanEqualDate,
    lessThanThanEqualDate,
    greaterThanEqualTime,
    lessThanEqualTime
};
