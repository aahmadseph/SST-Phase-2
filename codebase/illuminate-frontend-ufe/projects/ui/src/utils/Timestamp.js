// Output time in the following format 2016-04-07 12:22:21,844

function addZero(num) {
    return `${num}`.padStart(2, '0');
}

function addTwoZero(num) {
    return `${num}`.padStart(3, '0');
}

// TODO: if we switch to export, server tests will break with SyntaxError: Unexpected token 'export'
// we need to configure server folder/env to accept export and export default syntax.
module.exports = function printTimestamp() {
    var time = new Date();

    return (
        time.getFullYear() +
        '-' +
        addZero(time.getMonth() + 1) +
        '-' +
        addZero(time.getDate()) +
        ' ' +
        addZero(time.getHours()) +
        ':' +
        addZero(time.getMinutes()) +
        ':' +
        addZero(time.getSeconds()) +
        ',' +
        addTwoZero(time.getMilliseconds())
    );
};
