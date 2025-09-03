export default function getResource(label, vars = []) {
    const resources = {
        buyingGuide: 'Buying Guide'
    };

    return resources[label];
}
