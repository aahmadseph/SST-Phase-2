export default function getResource(label, vars = []) {
    const resources = {
        instructions: 'Select up to 3 free samples per order with a $25 minimum purchase. Subject to availability.'
    };

    return resources[label];
}
