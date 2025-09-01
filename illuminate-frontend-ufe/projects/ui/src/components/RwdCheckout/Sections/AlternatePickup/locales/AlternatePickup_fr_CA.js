export default function getResource (label, vars = []) {
    const resources = {
        alternatePickupPerson: 'Autre personne pour le ramassage',
        addAlternatePickup: 'Ajouter une autre personne pour le ramassage',
        addedAlternatePickup: 'Autre personne pour le ramassage ajoutée',
        addedAlternatePickupMsg: `${vars[0]} a été ajouté comme autre personne pour le ramassage de cette commande.`,
        alternatePickup: 'Autre personne pour le ramassage',
        firstName: 'Prénom',
        lastName: 'Nom de famille',
        email: 'Adresse de courriel',
        save: 'Enregistrer',
        saveAndContinue: 'Enregistrer et continuer',
        cancel: 'Annuler',
        edit: 'Modifier',
        remove: 'Retirer',
        ok: 'OK',
        addAltPickup: `Pour ajouter une autre personne pouvant s’occuper du ramassage, allez à ${vars[0]}.`,
        updateAltPickup: `Pour modifier ou supprimer l’autre personne pouvant s’occuper du ramassage, allez à ${vars[0]}.`,
        orderDetails: 'Détails de la commande',
        removeAltPickupTitle: 'Supprimer une autre personne pour le ramassage',
        removeAltPickupMessage: 'Êtes-vous sûr de vouloir supprimer l’autre personne pouvant s’occuper du ramassage de cette commande?',
        cannotModifyMessage: 'Désolé, votre commande ne peut pas encore être modifiée. Veuillez attendre au moins une minute de plus et essayer de nouveau.',
        genericErrorMessage: 'Oups! Un problème est survenu et votre commande n’a pas pu être modifiée. Veuillez réessayer plus tard.'
    };
    return resources[label];
}
