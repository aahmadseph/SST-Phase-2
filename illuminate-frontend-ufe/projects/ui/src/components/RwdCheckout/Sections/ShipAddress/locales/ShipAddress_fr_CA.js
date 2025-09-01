export default function getResource(label, vars = []) {
    const resources = {
        removeAddressLabel: 'Supprimer l’adresse',
        remove: 'Retirer',
        editAddressLabel: 'Modifier l’adresse',
        edit: 'Modifier',
        addShippingAddress: 'Ajouter une adresse de livraison',
        showMoreAddresses: 'Voir plus d’adresses',
        showLessAddresses: 'Voir moins d’adresses',
        deliveryMethod: 'Mode de livraison',
        setAsDefaultCheckbox: 'Définir comme l’adresse d’expédition par défaut',
        editShipAddress: 'Modifier l’adresse d’expédition',
        addNewShipAddress: 'Ajouter une nouvelle adresse d’expédition',
        cancelButton: 'Annuler',
        saveContinueButton: 'Enregistrer et continuer',
        continueButton: 'Continuer',
        maxShipAddressMessage: `Vous pouvez avoir jusqu’à ${vars[0]} adresses. Veuillez en supprimer une et en ajouter une autre à nouveau.`,
        areYouSureMessage: 'Êtes-vous sûr de vouloir supprimer votre adresse de façon définitive?',
        taxExemptAddressLabel: 'Adresse d’exemption de taxes'
    };

    return resources[label];
}
