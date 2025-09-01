export default function getResource(label, vars = []) {
    const resources = {
        haveAccount: 'Vous avez un compte Sephora?',
        signIn: 'Ouvrir une session',
        continueAsGuest: 'Continuer sans créer de compte',
        createAccountAfterBooking: 'Vous aurez la possibilité de créer un compte après la réservation.'
    };

    return resources[label];
}
