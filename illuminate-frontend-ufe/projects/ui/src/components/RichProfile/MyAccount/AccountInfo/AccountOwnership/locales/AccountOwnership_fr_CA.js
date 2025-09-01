export default function getResource(label) {
    const resources = {
        accountOwnership: 'Propriété du compte',
        accountIsOpen: 'Votre compte est actuellement actif',
        closeAccount: 'Fermer le compte'
    };
    return resources[label];
}
