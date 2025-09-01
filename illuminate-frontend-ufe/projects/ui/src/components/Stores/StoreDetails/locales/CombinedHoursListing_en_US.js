export default function getResource(label, vars = []) {
    const resources = {
        storeHoursTitle: 'Store Hours',
        openUntil: `Open until ${vars[0]} today`,
        availableUntil: `Available until ${vars[0]} today`,
        tempClosed: 'Temporarily Closed',
        tempUnavailable: 'Temporarily Unavailable',
        specialStoreHoursTitle: 'Special Store Hours',
        curbsideHoursTitle: 'Curbside Hours',
        specialCurbsideHours: 'Special Curbside Hours',
        unavailableToday: 'Unavailable today'
    };

    return resources[label];
}
