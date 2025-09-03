export default function getResource(label, vars = []) {
    const resources = {
        colorIQHistoryTitle: 'Your Saved Color IQ Values',
        latest: 'CURRENT',
        captured: 'Captured',
        gotIt: 'Got It',
        viewAll: 'View All'
    };

    return resources[label];
}
