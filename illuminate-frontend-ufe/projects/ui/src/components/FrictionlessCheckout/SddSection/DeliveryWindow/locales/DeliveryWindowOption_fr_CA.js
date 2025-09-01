export default function getResource(label) {
    const resources = {
        free: 'Gratuit',
        freeForSDU: 'GRATUIT pour les abonnés à la livraison le jour même illimitée',
        ok: 'OK',
        errorTitle: 'Erreur'
    };

    return resources[label];
}
