const resources = {
    nameError: 'Veuillez remplir ce champ.',
    name: 'Nom',
    edit: 'Modifier',
    firstNameLabel: 'Prénom',
    lastNameLabel: 'Nom de famille',
    cancel: 'Annuler',
    update: 'Mise à jour'
};

export default function getResource(label) {
    return resources[label];
}
