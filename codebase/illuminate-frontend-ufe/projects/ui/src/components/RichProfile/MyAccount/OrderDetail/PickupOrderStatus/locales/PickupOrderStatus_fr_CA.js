export default function getResource(label, vars = []) {
    const resources = {
        statusLabel: 'Statut',
        pickupWindowLabel: 'Temps alloué pour le ramassage',
        pickupStoreLabel: 'Magasin où ramasser la commande',
        pickedUp: 'Ramassé',
        pickupPerson: 'Personne qui ramassera la commande',
        billingInfo: 'Infos de facturation',
        mapLink: 'Plan',
        storeDetailsLink: 'Détails du magasin',
        confirmationId: 'Veuillez avoir en main votre *courriel de confirmation* ou une *pièce d’identité* avec photo au moment du ramassage de votre commande.',
        seeFaqs: 'Voir la FAQ'
    };

    return resources[label];
}
