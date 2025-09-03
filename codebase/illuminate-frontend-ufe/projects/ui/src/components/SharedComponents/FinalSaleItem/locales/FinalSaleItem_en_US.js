export default function getResource(label, vars = []) {
    const resources = {
        finalSaleItem: 'Final Sale: No returns or exchanges'
    };

    return resources[label];
}
