import dateUtils from 'utils/Date';

function getDayNodes(node) {
    const selector = '[data-calendar*="day"]';

    return node.querySelectorAll(selector);
}

function getDaySelectedNode(node) {
    const selector = '[data-calendar*="selected"]';

    return node.querySelector(selector);
}

function nodeListToArray(nodeList) {
    return Array.prototype.slice.call(nodeList, 0);
}

function buildCalendarUrl(startDate, duration, summary, options = {}) {
    const isoStartDate = dateUtils.formatISODateVariation(startDate);
    const isoEndDate = dateUtils.formatISODateVariation(startDate, duration);

    if (!isoStartDate || !isoEndDate) {
        return null;
    }

    const vCalEscape = str => str.trim().replace(/\s*\n/g, '\\n');

    let icsProperties = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `DTSTART:${isoStartDate}`,
        `DTEND:${isoEndDate}`,
        `SUMMARY:${encodeURIComponent(vCalEscape(summary))}`
    ];

    let description = options.description ? vCalEscape(options.description) : '';

    if (options.url) {
        description += `\\n${options.url.trim()}`;
    }

    description && icsProperties.push(`DESCRIPTION:${encodeURIComponent(description)}`);
    options.location && icsProperties.push(`LOCATION:${encodeURIComponent(vCalEscape(options.location))}`);
    icsProperties = icsProperties.concat(['END:VEVENT', 'END:VCALENDAR']);

    return 'data:text/calendar;charset=utf8,' + icsProperties.join('%0A');
}

export default {
    getDayNodes,
    nodeListToArray,
    getDaySelectedNode,
    buildCalendarUrl
};
