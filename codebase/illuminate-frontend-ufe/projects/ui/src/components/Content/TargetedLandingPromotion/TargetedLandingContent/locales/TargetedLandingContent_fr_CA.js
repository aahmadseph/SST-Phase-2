export default function getResource(label) {
    const resources = {
        redemptionInstructions: 'Directives pour l’échange :',
        redeemOnline: 'Pour échanger en ligne, inscrire le code ',
        scanInStoreToRedeem: 'ou balayer le code à barres ci-dessous en magasin pour l’échanger',
        shopNow: 'Magasiner',
        valid: 'Valide'
    };

    return resources[label];
}
