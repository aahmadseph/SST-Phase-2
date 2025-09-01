export default function getResource(label) {
    const resources = {
        yourNextPurchase: 'Votre prochain achat',
        redemptionInstructions: 'Directives pour l’échange',
        barcodeScan: 'ou balayer le code à barres ci-dessous en magasin pour l’échanger',
        shopNow: 'Magasiner',
        redeemOnline: 'Pour échanger en ligne, inscrire le code',
        valid: 'Valide'
    };

    return resources[label];
}
