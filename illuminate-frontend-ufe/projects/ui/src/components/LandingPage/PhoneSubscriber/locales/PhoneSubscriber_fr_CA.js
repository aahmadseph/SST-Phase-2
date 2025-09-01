export default function getResource(label) {
    const resources = {
        buttonLabel: 'S’inscrire maintenant',
        inputLabel: 'Numéro de téléphone cellulaire',
        mobilePhoneEmptyError: 'Veuillez saisir un numéro de téléphone cellulaire.',
        mobilePhoneInvalidError: 'Veuillez saisir un numéro de téléphone cellulaire valable.',
        serverErrorMessage: 'Oups! Nous avons eu de la difficulté à traiter votre demande. Veuillez essayer de nouveau.'
    };

    return resources[label];
}
