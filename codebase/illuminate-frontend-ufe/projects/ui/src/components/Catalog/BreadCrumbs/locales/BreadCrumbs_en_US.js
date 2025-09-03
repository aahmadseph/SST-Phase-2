export default function getResource(label, vars = []) {
    const resources = {
        sale: 'Sale',
        allKeywordResults: `All "${vars[0]}" results`
    };

    return resources[label];
}
