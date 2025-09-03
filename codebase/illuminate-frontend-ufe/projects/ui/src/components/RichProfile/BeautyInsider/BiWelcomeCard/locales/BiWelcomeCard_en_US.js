export default function getResource(label, vars = []) {
    const resources = {
        welcomeTo: 'Welcome to',
        beautyInsider: 'Beauty Insider',
        joinNow: 'Join Now'
    };

    return resources[label];
}
