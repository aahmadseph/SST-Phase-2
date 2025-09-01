export default function getResource(label, vars = []) {
    const resources = {
        buyingGuide: 'Guide d’achats'
    };

    return resources[label];
}
