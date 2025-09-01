export default function getResource(label, vars = []) {
    const resources = {
        pickupPerson: 'Personne qui ramassera la commande',
        idRequired: 'Vous aurez besoin d’une pièce d’identité qui correspond au nom ci-dessous pour récupérer votre commande. Les colis seront conservés pendant cinq jours avant d’être retournés.',
        idRequiredCA: 'Vous aurez besoin d’une pièce d’identité qui correspond au nom et à l’adresse ci-dessous pour récupérer votre commande. Les colis seront conservés pendant 15 jours avant d’être retournés.',
        firstName: 'Prénom',
        lastName: 'Nom de famille',
        phoneNumber: 'Numéro de téléphone',
        email: 'Adresse courriel',
        emailRequiredText: 'Vous devez fournir votre adresse courriel pour recevoir les notifications d’expédition et suivre votre commande.',
        streetAddress: 'Adresse',
        addressLine2: 'Appartement, étage, etc.',
        postalCode: 'Code postal',
        invalidPostalCode: 'Veuillez saisir un code zip valide.',
        enterPostalCode: 'Entrez le code postal pour voir la ville et la province.',
        city: 'Ville',
        province: 'Province',
        shipToAddress: 'Adresse d’expédition'
    };

    return resources[label];
}
