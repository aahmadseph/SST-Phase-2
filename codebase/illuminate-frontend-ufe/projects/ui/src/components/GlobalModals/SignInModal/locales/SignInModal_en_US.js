export default function getResource(label, vars = []) {
    const resources = {
        modalTitle: 'Please sign in to Sephora',
        beautyInsiderAlt: 'Beauty Insider'
    };

    return resources[label];
}
