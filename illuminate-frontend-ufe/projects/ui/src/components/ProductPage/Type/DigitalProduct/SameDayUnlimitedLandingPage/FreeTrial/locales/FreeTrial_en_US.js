export default function getResource(label) {
    const resources = {
        free30DayTrial: 'FREE 30-day trial',
        then: 'then',
        annually: '$49 annually',
        joinForOnly: 'Join for only'
    };

    return resources[label];
}
