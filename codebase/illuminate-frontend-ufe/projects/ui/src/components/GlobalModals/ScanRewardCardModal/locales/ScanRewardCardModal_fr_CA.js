export default function getResource(label, vars = []) {
    const resources = {
        scanCards: 'Balayer les cartes',
        scanAtCheckout: 'Balayer lors du passage à la caisse',
        showBarcode: 'Montrez le code à barres à un hôte de caisse pour accumuler des points ou obtenir des récompenses.',
        rewardsText: 'Les récompenses seront appliquées au sous-total.',
        termsAndConditions: 'Conditions'
    };
    return resources[label];
}
