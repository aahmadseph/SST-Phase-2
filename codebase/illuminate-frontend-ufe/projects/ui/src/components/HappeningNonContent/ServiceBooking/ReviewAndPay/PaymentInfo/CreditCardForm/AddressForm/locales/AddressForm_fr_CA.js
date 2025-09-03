const resources = {
    usName: 'États-Unis',
    caName: 'Canada',
    firstName: 'Prénom',
    lastName: 'Nom de famille',
    address2Label: 'App / unité/étage (facultatif)',
    add: 'Ajouter',
    country: 'Pays',
    streetAddress: 'Adresse',
    city: 'Ville',
    phone: 'Téléphone',
    postalCode: 'Code postal',
    zipPostalCode: 'Code postal',
    enterZipCodeText: 'Code postal',
    region: 'Région',
    stateRegion: 'État/Région',
    province: 'Province'
};

export default function getResource(label) {
    return resources[label];
}
