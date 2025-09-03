const resources = {
    add: 'Ajouter',
    address2Label: 'Avertisseur de porte, code du bâtiment, numéro d’app... etc.',
    city: 'Ville',
    country: 'Pays',
    enterZipCode: 'Saisir un code ZIP/postal pour voir la ville et l’État/la région',
    phone: 'Numéro de téléphone',
    postalCode: 'Code postal',
    stateRegion: 'État/Région',
    streetAddress: 'Adresse',
    zipPostalCode: 'Code postal'
};

export default function getResource(label) {
    return resources[label];
}
