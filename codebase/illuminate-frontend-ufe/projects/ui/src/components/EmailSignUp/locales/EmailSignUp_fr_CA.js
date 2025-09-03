export default function getResource(label, vars = []) {
    const resources = {
        signUpLabel: 'S’inscrire pour recevoir les courriels de Sephora',
        emailPlaceholder: 'Veuillez inscrire votre adresse courriel',
        signUpSuccessMessage: 'Nous vous remercions de votre inscription aux courriels Sephora!',
        sameEmailErrorMessage: 'Veuillez saisir votre adresse courriel.',
        button: 'S’inscrire'
    };

    return resources[label];
}
