const resources = {
    usName: 'États-Unis',
    caName: 'Canada',
    firstName: 'Prénom',
    lastName: 'Nom de famille',
    address2Label: 'Avertisseur de porte, code du bâtiment, numéro d’app... etc.',
    add: 'Ajouter',
    country: 'Pays',
    streetAddress: 'Adresse',
    city: 'Ville',
    phone: 'Téléphone',
    postalCode: 'Code postal',
    zipPostalCode: 'Code postal',
    emailAddress: 'Adresse de courriel',
    enterZipCodeText: 'Saisir un code ZIP/postal pour voir la ville et l’État/la région.',
    region: 'Région',
    stateRegion: 'État/Région',
    province: 'Province',
    emailRequiredText: 'Vous devez fournir votre adresse courriel pour recevoir les notifications d’expédition et suivre votre commande.',
    optional: '(facultatif)',
    phoneContext: '(pour les questions sur la livraison)'
};

export default function getResource(label) {
    return resources[label];
}
