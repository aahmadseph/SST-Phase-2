export default function getResource(label, vars = []) {
    const resources = {
        savedAddresses: 'Adresses enregistrées',
        defaultShippingAddress: 'Adresse d’expédition par défaut',
        setAsDefaultAddress: 'Définir en tant qu’adresse par défaut',
        edit: 'Modifier',
        delete: 'Supprimer',
        addShippingAddress: 'Ajouter une adresse de livraison',
        title: 'Supprimer l’adresse',
        message: 'Vous avez dépassé le nombre maximal d’adresses sauvegardées. Veuillez en supprimer une et en ajouter une autre à nouveau.',
        buttonText: 'Continuer',
        taxExemptAddressLabel: 'Adresse d’exemption de taxes',
        deleteTaxExemptAddresModalTitle: 'Voulez-vous supprimer l’adresse?',
        deleteTaxExemptAddresModalMessage: 'Si vous supprimez cette adresse, vous supprimerez également votre statut d’exemption de taxes et devrez soumettre une nouvelle demande d’exemption.',
        yes: 'Oui',
        no: 'Non'
    };
    return resources[label];
}
