export default function getResource(label, vars=[]) {
    const resources = {
        size: 'Format',
        color: 'Couleur',
        finalSale: '*Vente finale :* aucun retour ni échange'
    };

    return resources[label];
}
