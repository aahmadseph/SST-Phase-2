export default function getResource(label, vars = []) {
    const resources = {
        beautyServices: 'Beauty Services FAQ',
        happeningAtSephora: 'Happening at Sephora',
        servicesAndEvents: 'Services and Events',
        makeupServices: 'Makeup Services'
    };

    return resources[label];
}
