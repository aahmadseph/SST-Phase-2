export default function getResource(label, vars = []) {
    const resources = {
        finalSaleItem: 'Vente finale : Aucun retour ni échange'
    };

    return resources[label];
}
