export default function getResource(label, vars = []) {
    const resources = {
        sale: 'Solde',
        allKeywordResults: `Tous les « ${vars[0]} » résultats`
    };

    return resources[label];
}
