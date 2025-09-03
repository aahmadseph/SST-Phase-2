const resources = {
    pickupCardTitle: 'Renseignements sur le ramassage',
    pickupStore: 'Magasin où ramasser la commande',
    pickupPerson: 'Personne qui ramassera la commande',
    altPickupPerson: 'Autre personne pour le ramassage',
    confirmationDetails: 'Veuillez avoir en main votre <b>courriel de confirmation</b> ou une <b>pièce d’identité avec photo</b> au moment du ramassage de votre commande.',
    addAltPickupPerson: 'Ajouter une autre personne pour le ramassage',
    usuallyReady: 'Normalement prêt en 2 heures',
    inStorePickup: 'Ramassage en magasin',
    curbsidePickup: 'Ramassage à l’extérieur',
    modalMessage: 'Une fois votre commande passée, le magasin la conservera pendant 5 jours. Lorsque votre commande sera prête, nous vous aviserons par courriel (normalement dans les 2 heures suivant votre commande).',
    gotIt: 'Compris',
    edit: 'Modifier',
    information: 'informations',
    forThisOrderText: 'sur cette commande',
    pickupConfirmationDetails: 'Détails sur la confirmation de ramassage',
    itemsToBePickedUp: 'Articles à ramasser'
};

export default function getResource(label) {
    return resources[label];
}
